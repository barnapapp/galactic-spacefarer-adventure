import cds from '@sap/cds';
import type { Request } from '@sap/cds';
import type { Spacefarer } from '#cds-models/galactic/spacefarer/adventure';
import { spacefarerValidation, sendCosmicNotification } from "./spacefarer-service.utils.ts";

export default class SpacefarerService extends cds.ApplicationService {

    async init(): Promise<void> {

        const { Spacefarers } = this.entities;

        this.before('CREATE', Spacefarers, (req: Request) => {
            const planet = req.user?.attr?.originPlanet
            if (!planet) return req.reject(403, 'No originPlanet attribute found')

            const spacefarer = req.data as Spacefarer;
            if(!spacefarer) return;

            req.data.originPlanet = planet
            spacefarerValidation(spacefarer, req);
        });

        this.before('UPDATE', Spacefarers, async (req: Request) => {
            const planet = req.user?.attr?.originPlanet;
            if (!planet) return req.reject(403);

            const existing = await SELECT.one.from(Spacefarers)
                .where({ ID: req.data.ID, originPlanet: planet });

            if (!existing) return req.reject(403, 'Not your record');

            req.data.originPlanet = planet;
        });

        this.before('DELETE', Spacefarers, async (req) => {
            const planet = req.user?.attr?.originPlanet;
            if (!planet) return req.reject(403);

            const existing = await SELECT.one.from(Spacefarers)
                .where({ ID: req.data.ID, originPlanet: planet });

            if (!existing) return req.reject(403, 'Not your record');
        });

        /* this.before('UPDATE', Spacefarers, (req: Request) => {
            const planet = req.user?.attr?.originPlanet;
            if (!planet) return req.reject(403);

            req.data.originPlanet = planet;
        }); */

        this.after('CREATE', Spacefarers, (data: Spacefarer | Spacefarer[]) => {
            const spacefarer = Array.isArray(data) ? data[0] : data;
            if (!spacefarer) return;

            sendCosmicNotification(spacefarer);
        });

        await super.init()
    }
}