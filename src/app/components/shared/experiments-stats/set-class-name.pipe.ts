import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setClassName',
})
export class SetClassNamePipe implements PipeTransform {
  transform(researchName: string): string {
    const classNames = new Map([
      ['increaseLifespan', 'research--increase-lifespan'],
      ['ageRelatedChangesOfGene', 'research--age-related-change'],
      ['interventionToGeneImprovesVitalProcesses', 'research--gene-intervention-to-vital-processes'],
      ['proteinRegulatesOtherGenes', 'research--protein-to-gene'],
      ['geneAssociatedWithProgeriaSyndromes', 'research--gene-to-progeria'],
      ['geneAssociatedWithLongevityEffects', 'research--gene-to-longevity-effect'],
      ['additionalEvidences', 'research--gene-to-additional-evidence'],
    ]);
    return classNames.get(researchName);
  }
}
