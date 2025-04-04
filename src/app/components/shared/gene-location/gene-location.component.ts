import { Component, Input } from '@angular/core';
import { GeneLocation } from '../../../core/models/open-genes-api/gene-location.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModalComponent } from '../../ui-components/modals/common-modal/common-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gene-location',
  templateUrl: './gene-location.component.html',
  styleUrls: ['./gene-location.component.scss'],
})
export class GeneLocationComponent {
  @Input() geneSymbol: string;
  @Input() ensemblId: string;

  @Input() set item(location: GeneLocation) {
    this.location = location;
    this.setGeneLength();
    this.setMarkerPosition();
  }

  public location: GeneLocation;
  public geneLength: number;
  public lengthText: string;

  public bandTranscript = {
    chromosome: '',
    arm: '',
    position: 50,
  };

  constructor(private translate: TranslateService, private dialog: MatDialog) {}

  setGeneLength(): void {
    this.lengthText = '';
    this.geneLength = Math.round((this.location.locationEnd - this.location.locationStart) / 1000);

    if (this.geneLength === 0) {
      return;
    }

    if (this.geneLength < 15 && this.geneLength !== 0) {
      const l = ` (${this.geneLength}kb < 15kb)`;
      this.lengthText = `${this.translate.instant('gene_length_short')} ${l}`;
    }

    if (this.geneLength > 15 && this.geneLength < 100) {
      const l = ` (15kb < ${this.geneLength}kb < 100kb)`;
      this.lengthText = `${this.translate.instant('gene_length_midlength')} ${l}`;
    }

    if (this.geneLength > 100) {
      const l = ` (${this.geneLength}kb > 100kb)`;
      this.lengthText = `${this.translate.instant('gene_length_long')} ${l}`;
    }
  }

  setMarkerPosition(): void {
    const shortBand = this.location.band.split('-')[0];

    if (shortBand.includes('p')) {
      const chromosome = shortBand.split('p');
      this.bandTranscript = {
        chromosome: chromosome[0],
        arm: this.translate.instant('chromosome_short_arm'),
        position: 50 - Number(chromosome[1]),
      };
    }

    if (shortBand.includes('c')) {
      const chromosome = shortBand.split('c');
      this.bandTranscript = {
        chromosome: chromosome[0],
        arm: this.translate.instant('chromosome_centromere'),
        position: Number(chromosome[1]),
      };
    }

    if (shortBand.includes('q')) {
      const chromosome = shortBand.split('q');
      this.bandTranscript = {
        chromosome: chromosome[0],
        arm: this.translate.instant('chromosome_long_arm'),
        position: 50 + Number(chromosome[1]),
      };
    }
  }


  showMoreDetails(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
      autoFocus: false,
    });
  }
}
