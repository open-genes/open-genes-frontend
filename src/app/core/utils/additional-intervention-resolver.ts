import { PurpleTable } from '../models/open-genes-api/researches.model';

export abstract class AdditionalInterventionResolver {
  resolveAdditionalIntervention(research: PurpleTable, targetGene = research.geneId) {
    if (typeof research !== undefined) {
      // if there is more than one intervention, it's an additional intervention
      let isNoAdditionalIntervention = true;

      if (research.interventions.controlAndExperiment.length + research.interventions.experiment.length > 1) {
        isNoAdditionalIntervention = false;
      }
      if (research.interventions.controlAndExperiment.length > 0) {
        isNoAdditionalIntervention = false;
      }
      if (research.interventions.experiment.length > 1) {
        isNoAdditionalIntervention = false;
      } else if (research.interventions.experiment.length === 1) {
        // временный костыль
        if (research.interventions.experiment[0]?.gene !== targetGene) {
          isNoAdditionalIntervention = false;
        }
      }
      return isNoAdditionalIntervention;
    }

    return;
  }
}
