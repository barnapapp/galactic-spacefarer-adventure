import cds from '@sap/cds';
export default class SpacefarerService extends cds.ApplicationService {
    async init() {
        const { Spacefarers } = this.entities;
        this.before('READ', Spacefarers, async (req) => {
            const planet = req.user?.attr?.originPlanet;
            if (planet) {
                req.query.where({ originPlanet: planet });
            }
        });
        await super.init();
    }
}
