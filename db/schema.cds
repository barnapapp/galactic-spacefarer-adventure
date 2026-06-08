using { managed, cuid } from '@sap/cds/common';
using { SpacesuitColor, SpacefarerStatus } from './types';

namespace galactic.spacefarer.adventure;

entity Departments : cuid, managed {
    name : String(100);
    sector : String(100);
    spacefarers : Association to many Spacefarers on spacefarers.department = $self;
}

entity Positions : cuid, managed {
    title : String(100);
    level : Integer;
    spacefarers : Association to many Spacefarers on spacefarers.position = $self;
}

entity Spacefarers : cuid, managed {
    name : String(100) @mandatory;
    email : String(255) @mandatory @assert.format : '^[^@]+@[^@]+\.[^@]+$';
    originPlanet : String(100) @mandatory;
    stardustCollection : Decimal(10,2) default 0;
    wormholeNavigationSkill : Integer default 1 @assert.range: [1, 10];
    spacesuitColor : SpacesuitColor;
    status : SpacefarerStatus default 'CANDIDATE';
    department : Association to Departments;
    position : Association to Positions;
}