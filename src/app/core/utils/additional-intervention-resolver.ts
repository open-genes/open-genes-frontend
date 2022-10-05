import { PurpleTable } from '../models/open-genes-api/studies.model';

export abstract class AdditionalInterventionResolver {
  resolveAdditionalIntervention(research: PurpleTable, targetGene = research.geneId): boolean {
    let isNoAdditionalIntervention = false;

    if (typeof research !== undefined) {
      if (research.interventions.controlAndExperiment.length === 0 && research.interventions.experiment.length === 1) {
        isNoAdditionalIntervention = true;
        // временный костыль
        if (research.interventions.experiment[0]?.gene !== targetGene) {
          isNoAdditionalIntervention = false;
        }
      }
    }

    return isNoAdditionalIntervention;
  }
}
