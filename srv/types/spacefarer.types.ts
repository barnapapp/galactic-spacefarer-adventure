export const SpacesuitColor = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    COSMIC_BLACK: 'COSMIC_BLACK'
} as const;

type SpacesuitColor = typeof SpacesuitColor[keyof typeof SpacesuitColor];

export const SpacefarerStatus = {
    CANDIDATE: 'CANDIDATE',
    TRAINING: 'TRAINING',
    ACTIVE: 'ACTIVE',
    RETIRED: 'RETIRED',
} as const;

type SpacefarerStatus = typeof SpacefarerStatus[keyof typeof SpacefarerStatus];

export type Spacefarer = {
    ID: string
    name: string
    email: string
    originPlanet: string
    stardustCollection: number
    wormholeNavigationSkill: number
    spacesuitColor: SpacesuitColor
    status: SpacefarerStatus
    department_ID?: string
    position_ID?: string
};