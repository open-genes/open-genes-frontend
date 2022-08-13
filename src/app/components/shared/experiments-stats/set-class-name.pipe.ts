import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setClassName',
})
export class SetClassNamePipe implements PipeTransform {
  transform(experimentName: string): string {
    const classNames = new Map([
      ['increaseLifespan', 'experiment--increase-lifespan'],
      ['ageRelatedChangesOfGene', 'experiment--age-related-change'],
      ['interventionToGeneImprovesVitalProcesses', 'experiment--gene-intervention-to-vital-processes'],
      ['proteinRegulatesOtherGenes', 'experiment--protein-to-gene'],
      ['geneAssociatedWithProgeriaSyndromes', 'experiment--gene-to-progeria'],
      ['geneAssociatedWithLongevityEffects', 'experiment--gene-to-longevity-effect'],
      ['additionalEvidences', 'experiment--gene-to-additional-evidence'],
    ]);
    return classNames.get(experimentName);
  }
}
