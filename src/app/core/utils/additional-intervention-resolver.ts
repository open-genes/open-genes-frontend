import { PurpleTable } from '../models/open-genes-api/researches.model';

export abstract class AdditionalInterventionResolver {
  resolveAdditionalIntervention(research: PurpleTable, targetGene = research.geneId): boolean {
    let isNoAdditionalIntervention = false;

    if (typeof research !== undefined) {
      if (research.interventions.controlAndExperiment.length === 0 && research.interventions.experiment.length === 1) {
        isNoAdditionalIntervention = true;
        // this fix exists until we establish API format for additional interventions
        if (research.interventions.experiment[0]?.gene !== targetGene) {
          isNoAdditionalIntervention = false;
        }
      }
    }

    return isNoAdditionalIntervention;
  }
}
