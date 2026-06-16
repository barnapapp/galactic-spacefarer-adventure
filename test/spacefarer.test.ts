import cds from '@sap/cds';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Spacefarer } from "#cds-models/galactic/spacefarer/adventure";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { GET, POST, PATCH, DELETE, expect, defaults } = cds.test(`${__dirname}/..`);

defaults.path = '/spacefarer';

const setRole = (username = 'testUser', password = 'test123') => ({
    auth: { username, password },
});

describe('Data access', () => {

    it('Editor can request the spacefarers list', async () => {
        const res = await GET('/Spacefarers', setRole());

        expect(res.status).to.equal(200);
        expect(res.data.value).to.be.an('array');
    });

    it('Viewer can request the spacefarers list', async () => {
        const res = await GET('/Spacefarers', setRole("testUser2", "test1234"));

        expect(res.status).to.equal(200);
        expect(res.data.value).to.be.an('array');
    });

    it('Returns a 401 without authentication', async () => {
        const res = await GET('/Spacefarers').catch((e: any) => e.response);
        expect(res.status).to.equal(401);
    });

});

describe('Planet-based filtering', () => {

    let marsId: string;
    let moonId: string;

    before(async () => {
        const db = await cds.connect.to('db');
        const { Spacefarers } = db.entities('galactic.spacefarer.adventure');

        await INSERT.into(Spacefarers).entries({
            name: 'Marsi Béla',
            email: 'bela@mars.com',
            originPlanet: 'Mars',
            wormholeNavigationSkill: 5,
            stardustCollection: 10,
            spacesuitColor: 'RED',
        });
        const mars = await SELECT.one.from(Spacefarers).where({ email: 'bela@mars.com' });
        marsId = mars?.ID;

        await INSERT.into(Spacefarers).entries({
            name: 'Holdi Anna',
            email: 'anna@moon.com',
            originPlanet: 'Moon',
            wormholeNavigationSkill: 3,
            stardustCollection: 5,
            spacesuitColor: 'BLUE',
        });
        const moon = await SELECT.one.from(Spacefarers).where({ email: 'anna@moon.com' });
        moonId = moon?.ID;
    });

    it('Mars Editor only access Mars records', async () => {
        const res = await GET('/Spacefarers', setRole());
        const planets = res.data.value.map((s: Spacefarer) => s.originPlanet);

        expect(planets.every((p: string) => p === 'Mars')).to.be.true;
    });

    it('Moon Viewer only access Moon records', async () => {
        const res = await GET('/Spacefarers', setRole("testUser2", "test1234"));
        const planets = res.data.value.map((s: Spacefarer) => s.originPlanet);

        expect(planets.every((p: string) => p === 'Moon')).to.be.true;
    });

    it('Mars Editor cannot modify the Moon record (403)', async () => {
        const res = await POST(
            `/Spacefarers(ID=${moonId},IsActiveEntity=true)/SpacefarerService.draftEdit`,
            { PreserveChanges: false },
            setRole()
        ).catch((e: any) => e.response);

        expect(res.status).to.equal(403);
    });

    it('Mars Editor cannot delete the Moon record (403)', async () => {
        const res = await DELETE(
            `/Spacefarers(ID=${moonId},IsActiveEntity=true)`,
            setRole()
        ).catch((e: any) => e.response);

        expect(res.status).to.equal(403);
    });
});


describe('Validation (CREATE)', () => {

    async function createSpacefarer(payload: Spacefarer, authOpts = setRole()) {
        const draft = await POST('/Spacefarers', payload, authOpts);
        const id = draft.data.ID;

        await PATCH(
            `/Spacefarers(ID=${id},IsActiveEntity=false)`,
            { originPlanet: 'placeholder' },
            authOpts
        );

        return POST(
            `/Spacefarers(ID=${id},IsActiveEntity=false)/SpacefarerService.draftActivate`,
            {},
            authOpts
        );
    }

    async function tryCreateSpacefarer(payload: Spacefarer, authOpts = setRole()) {
        const draft = await POST('/Spacefarers', payload, authOpts);
        const id = draft.data.ID;

        await PATCH(
            `/Spacefarers(ID=${id},IsActiveEntity=false)`,
            { originPlanet: 'placeholder' },
            authOpts
        );

        return POST(
            `/Spacefarers(ID=${id},IsActiveEntity=false)/SpacefarerService.draftActivate`,
            {},
            authOpts
        ).catch((e: any) => e.response);
    }

    const validPayload = () => ({
        name: 'Test Spacefarer',
        email: `test-${Date.now()}@galaxy.com`,
        wormholeNavigationSkill: 5,
        stardustCollection: 20,
        spacesuitColor: 'GOLD',
    });

    it('Creation successful with valid data (201)', async () => {
        const res = await createSpacefarer(validPayload());

        expect(res.status).to.equal(201);
        expect(res.data.originPlanet).to.equal('Mars');
    });

    it('Negative stardustCollection → 400', async () => {
        const res = await tryCreateSpacefarer({
            ...validPayload(),
            stardustCollection: -5,
        });

        expect(res.status).to.equal(400);
        expect(res.data.error.message).to.include('negative');
    });

    it('wormholeNavigationSkill = 0 → 400', async () => {
        const res = await tryCreateSpacefarer({
            ...validPayload(),
            wormholeNavigationSkill: 0,
        });
        expect(res.status).to.equal(400);

        const messages = [
            res.data.error.message,
            ...(res.data.error.details ?? []).map((d: any) => d.message)
        ].join(' | ');
        expect(messages).to.include('between 1 and 10');
    });

    it('wormholeNavigationSkill = 11 → 400', async () => {
        const res = await tryCreateSpacefarer({
            ...validPayload(),
            wormholeNavigationSkill: 11,
        });
        expect(res.status).to.equal(400);

        const messages = [
            res.data.error.message,
            ...(res.data.error.details ?? []).map((d: any) => d.message)
        ].join(' | ');
        expect(messages).to.include('between 1 and 10');
    });

    it('wormholeNavigationSkill >= 9 → +100 stardust bonus', async () => {
        const res = await createSpacefarer({
            ...validPayload(),
            wormholeNavigationSkill: 9,
            stardustCollection: 50,
        });

        expect(res.status).to.equal(201);
        expect(res.data.stardustCollection).to.equal(150);
    });

    it('Missing spacesuitColor → default COSMIC_BLACK', async () => {
        const { spacesuitColor, ...withoutColor } = validPayload();
        const res = await createSpacefarer(withoutColor);

        expect(res.status).to.equal(201);
        expect(res.data.spacesuitColor).to.equal('COSMIC_BLACK');
    });

    it('originPlanet is automatically set to the user s planet', async () => {
        const res = await createSpacefarer({ ...validPayload(), originPlanet: 'Jupiter' });

        expect(res.status).to.equal(201);
        expect(res.data.originPlanet).to.equal('Mars');
    });

    it('Viewer cannot create a record (403)', async () => {
        const res = await POST('/Spacefarers', validPayload(), setRole("testUser2", "test1234"))
            .catch((e: any) => e.response);

        expect(res.status).to.equal(403);
    });
});

describe('Validation (UPDATE)', () => {

    let ownId: string;

    before(async () => {
        const draft = await POST('/Spacefarers', {
            name: 'Updated Spacefarer',
            email: `update-${Date.now()}@galaxy.com`,
            wormholeNavigationSkill: 4,
            stardustCollection: 30,
            spacesuitColor: 'SILVER',
        }, setRole());

        const id = draft.data.ID;
        await PATCH(`/Spacefarers(ID=${id},IsActiveEntity=false)`, { originPlanet: 'placeholder' }, setRole());

        const active = await POST(`/Spacefarers(ID=${id},IsActiveEntity=false)/SpacefarerService.draftActivate`, {}, setRole());
        ownId = active.data.ID;
    });

    it('Personal record successfully updated', async () => {
        await POST(`/Spacefarers(ID=${ownId},IsActiveEntity=true)/SpacefarerService.draftEdit`, { PreserveChanges: false }, setRole());
        const res = await PATCH(`/Spacefarers(ID=${ownId},IsActiveEntity=false)`, { stardustCollection: 40 }, setRole());

        expect(res.status).to.be.oneOf([200, 204]);
        await POST(`/Spacefarers(ID=${ownId},IsActiveEntity=false)/SpacefarerService.draftActivate`, {}, setRole());
    });

    it('originPlanet cannot be modified, not even during an UPDATE', async () => {
        await POST(`/Spacefarers(ID=${ownId},IsActiveEntity=true)/SpacefarerService.draftEdit`, { PreserveChanges: false }, setRole());
        await PATCH(`/Spacefarers(ID=${ownId},IsActiveEntity=false)`, { originPlanet: 'Venus' }, setRole());
        await POST(`/Spacefarers(ID=${ownId},IsActiveEntity=false)/SpacefarerService.draftActivate`, {}, setRole());

        const check = await GET(`/Spacefarers(ID=${ownId},IsActiveEntity=true)`, setRole());
        expect(check.data.originPlanet).to.equal('Mars');
    });

});

describe('Read-only entities', () => {

    it('List of departments available (200)', async () => {
        const res = await GET('/Departments', setRole());

        expect(res.status).to.equal(200);
    });

    it('List of positions available (200)', async () => {
        const res = await GET('/Positions', setRole());

        expect(res.status).to.equal(200);
    });

    it('Departments cannot be written (405 or 403)', async () => {
        const res = await POST('/Departments', { name: 'Hack' }, setRole())
            .catch((e: any) => e.response);

        expect(res.status).to.be.oneOf([403, 405]);
    });

});