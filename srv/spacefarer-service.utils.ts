import type { Spacefarer } from '#cds-models/galactic/spacefarer/adventure';
import type { Request } from '@sap/cds';

export const SpacesuitColor = {
    RED: 'RED',
    BLUE: 'BLUE',
    GREEN: 'GREEN',
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    COSMIC_BLACK: 'COSMIC_BLACK'
} as const;

export const spacefarerValidation = (spacefarer: Spacefarer, req: Request) => {
    const stardustCollection = spacefarer.stardustCollection ?? 0
    const wormholeSkill = spacefarer.wormholeNavigationSkill ?? 0

    if (stardustCollection < 0) {
        req.error(400, 'Stardust collection cannot be negative!')
    }

    if (wormholeSkill < 1 || wormholeSkill > 10) {
        req.error(400, 'Wormhole navigation skill must be between 1 and 10!')
    }

    if (wormholeSkill >= 9) {
        spacefarer.stardustCollection = (spacefarer.stardustCollection || 0) + 100
        console.log(`${spacefarer.name} received +100 stardust for high navigation skill.`)
    }

    if (!spacefarer.spacesuitColor) {
        spacefarer.spacesuitColor = SpacesuitColor.COSMIC_BLACK;
        console.log(`Default spacesuit color set to COSMIC_BLACK for ${spacefarer.name}`)
    }
};

export const sendCosmicNotification = (spacefarer: Spacefarer) => {
    const message = `
        To: ${spacefarer.email}
        Subject: Welcome to the Galactic Spacefarer Program!

        Dear ${spacefarer.name},

        Congratulations!!

        Your cosmic profile:
        - Origin Planet       : ${spacefarer.originPlanet}
        - Stardust Collection : ${spacefarer.stardustCollection}
        - Wormhole Skill      : ${spacefarer.wormholeNavigationSkill}/100
        - Spacesuit Color     : ${spacefarer.spacesuitColor}
        - Status              : ${spacefarer.status}

        May the stardust guide your path!

        The Galactic Spacefarer Command`;

    console.log(message)
};