using { galactic.spacefarer.adventure as db } from '../db/schema';

@requires: 'authenticated-user'
@impl: 'srv/spacefarer-service.ts'
service SpacefarerService @(path: '/spacefarer') {

    @odata.draft.enabled: true
    entity Spacefarers as projection on db.Spacefarers;

    @readonly
    entity Departments as projection on db.Departments;

    @readonly
    entity Positions as projection on db.Positions;
}