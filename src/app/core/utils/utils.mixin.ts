import { ToMap } from './to-map';
import { AdditionalInterventionResolver } from './additional-intervention-resolver';
import { PurpleTable } from '../models/open-genes-api/researches.model';

function applyUtils(derivedConstructor: any, baseConstructors: any[]) {
  baseConstructors.forEach((baseConstructor) => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach((name) => {
      if (name !== 'constructor') {
        derivedConstructor.prototype[name] = baseConstructor.prototype[name];
      }
    });
  });
}

export class Utils implements ToMap, AdditionalInterventionResolver {
  public resolveAdditionalIntervention: (research: PurpleTable, targetGene?: number) => any;
  public toMap: (object: any) => Map<any, any>;
}
applyUtils(Utils, [ToMap, AdditionalInterventionResolver]);
