import cds from '@sap/cds';
import type { SpacefarerRequest } from "./types/cds.types";
import type { Spacefarer } from "./types/spacefarer.types";
import { spacefarerValidation, sendCosmicNotification } from "./spacefarer-service.utils.ts";

export default class SpacefarerService extends cds.ApplicationService {

    async init(): Promise<void> {

        const { Spacefarers } = this.entities

        this.before('READ', Spacefarers, (req: SpacefarerRequest) => {
            const planet = req.user?.attr?.originPlanet
            if (planet) {
                req.query.where({ originPlanet: planet })
            }
        });

        this.before('CREATE', Spacefarers, (req: SpacefarerRequest) => {
            const spacefarer = req.data as Spacefarer;
            if(!spacefarer) return;

            spacefarerValidation(spacefarer, req);
        });

        this.after('CREATE', Spacefarers, (spacefarer: Spacefarer) => {
            sendCosmicNotification(spacefarer);
        });

        await super.init()
    }
}