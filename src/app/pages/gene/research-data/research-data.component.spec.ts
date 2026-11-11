import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Studies } from '../../../core/models/open-genes-api/studies.model';
import { ResearchDataComponent } from './research-data.component';

@Pipe({ name: 'translate' })
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ResearchDataComponent study panels', () => {
  let fixture: ComponentFixture<ResearchDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ResearchDataComponent, TranslatePipeStub],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ResearchDataComponent, {
        set: { styles: [], styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ResearchDataComponent);
  });

  afterEach(() => fixture?.destroy());

  [false, true].forEach(hasInterventions => {
    [false, true].forEach(hasLongevityStudies => {
      it(`renders panels independently when interventions=${hasInterventions} and longevity=${hasLongevityStudies}`, () => {
        fixture.componentInstance.studies = {
          increaseLifespan: [],
          ageRelatedChangesOfGene: [],
          interventionToGeneImprovesVitalProcesses: hasInterventions ? [{}] : [],
          geneAssociatedWithLongevityEffects: hasLongevityStudies ? [{}, {}] : [],
          geneAssociatedWithProgeriaSyndromes: [],
          proteinRegulatesOtherGenes: [],
          additionalEvidences: [],
        } as unknown as Studies;

        fixture.detectChanges();

        const root: HTMLElement = fixture.nativeElement;
        const longevityTable = root.querySelector('app-gene-associated-with-longevity-effects');
        const interventionTable = root.querySelector('app-intervention-affects-aging-process');

        expect(!!longevityTable).toBe(hasLongevityStudies);
        expect(!!interventionTable).toBe(hasInterventions);
        expect(root.querySelectorAll('mat-expansion-panel').length)
          .toBe(Number(hasInterventions) + Number(hasLongevityStudies));

        if (hasLongevityStudies) {
          const panel = longevityTable!.closest('mat-expansion-panel')!;
          expect(panel.querySelector('.counter')!.textContent!.trim()).toBe('2');
        }
      });
    });
  });
});
