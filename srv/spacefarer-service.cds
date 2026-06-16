using { galactic.spacefarer.adventure as db } from '../db/schema';

@requires: 'authenticated-user'
@impl: 'srv/spacefarer-service.ts'
service SpacefarerService @(path: '/spacefarer') {

    @odata.draft.enabled: true
    @(restrict: [
      {
        grant: ['READ'],
        to: ['Viewer', 'Editor'],
        where: 'originPlanet = $user.originPlanet'
      },
      {
        grant: ['CREATE', 'UPDATE', 'DELETE'],
        to: 'Editor',
        where: 'originPlanet = $user.originPlanet'
      }
    ])
    entity Spacefarers as projection on db.Spacefarers;

    @readonly
    entity Departments as projection on db.Departments;

    @readonly
    entity Positions as projection on db.Positions;
}