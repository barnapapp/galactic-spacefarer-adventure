import { type Spacefarer, SpacesuitColor } from "./types/spacefarer.types.ts";
import type { SpacefarerRequest } from "./types/cds.types";

export const spacefarerValidation = (spacefarer: Spacefarer, req: SpacefarerRequest) => {
    if (spacefarer?.stardustCollection < 0) {
        req.error(400, 'Stardust collection cannot be negative!')
    }

    if (spacefarer.wormholeNavigationSkill < 1 || spacefarer.wormholeNavigationSkill > 10) {
        req.error(400, 'Wormhole navigation skill must be between 1 and 10!')
    }

    if (spacefarer.wormholeNavigationSkill >= 9) {
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