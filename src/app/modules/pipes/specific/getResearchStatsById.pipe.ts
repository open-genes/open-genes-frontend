import { Pipe, PipeTransform } from "@angular/core";
import { ApiService } from '../../../core/services/api/open-genes.api.service';

interface IResearchTypes {
  [n: number]: any
}

@Pipe({
  name: "getResearchStatsById",
  pure: false,
})
export class getResearchStatsById implements PipeTransform {
  private researchStatsObj: IResearchTypes;

  constructor(
    private apiService: ApiService,
  ) {
  }

  transform(symbol: string): void {
    this.apiService.getGeneByHGNCsymbol(symbol)
      .subscribe(
        (gene) => {
          const a = gene?.['researches'];

          this.researchStatsObj = {
            1: a.increaseLifespan.length,
            2: a.ageRelatedChangesOfGene.length,
            3: a.interventionToGeneImprovesVitalProcesses.length,
            4: a.proteinRegulatesOtherGenes.length,
            5: a.geneAssociatedWithProgeriaSyndromes.length,
            6: a.geneAssociatedWithLongevityEffects.length
          };

        }).unsubscribe();
  }
}

