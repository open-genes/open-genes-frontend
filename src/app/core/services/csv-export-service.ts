import { Injectable } from '@angular/core';
import { ApiService } from './api/open-genes-api.service';
import { of, Subject } from 'rxjs';
import { Genes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  constructor(private apiService: ApiService) {}

  private subscription$ = new Subject();
  private genes: Genes[];

  static wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  static async FetchResource(url, delay, tries, fetchOptions) {
    function onError(err) {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        console.log(err);
      }
      return CsvExportService.wait(delay).then(() =>
        CsvExportService.FetchResource(url, delay, triesLeft, fetchOptions)
      );
    }

    return fetch(url, fetchOptions).catch(onError);
  }

  private sanitize(string) {
    if (typeof string === 'string') {
      return string.replace('"', '');
    }
    return string;
  }

  private checkBlankValues(field, prepend = '', append = '', isReplacementValue = true) {
    if (field === undefined || field === null || field === '' || field === []) {
      return isReplacementValue ? 'n/a' : '';
    } else {
      return `${prepend}${field}${append}`;
    }
  }

  public async generateGenesDiseasesTable() {
    let resultingString = '';
    const response = await CsvExportService.FetchResource(
      `https://open-genes.com/api/gene/search?pageSize=600`,
      0,
      1,
      {}
    );

    if (response) {
      const resJson = await response.json();
      const genes = resJson.items;
      if (genes) {
        console.log('genes:', genes);
        const csvHeader = '"HGNC", "diseases"\n';
        resultingString = resultingString + csvHeader;
        for (const gene of genes) {
          const diseases = gene.diseases.map((d) => `'${d.name}'`);
          const csvRow = `"${gene.symbol}", "${diseases}"\n`;
          resultingString = resultingString + csvRow;
        }
        return resultingString;
      }
    }

    return null;
  }

  public generateGenesAgingMechanismsTable() {
    let resulingString = '';
    const csvHeader = '"HGNC", "diseases"\n';
    resulingString = resulingString + csvHeader;
    for (const gene of this.genes) {
      const mechanisms = gene.agingMechanisms.map((d) => `'${d.name}'`);
      const csvRow = `"${gene.symbol}", "${mechanisms}"\n`;
      resulingString = resulingString + csvRow;
    }
    return of(resulingString);
  }

  public generateYellowTable() {
    let resulingString = '';
    const csvHeader = '"HGNC", "comment", "doi", "pmid", "proteinActivity", "regulatedGene", "regulationType"\n';
    resulingString = resulingString + csvHeader;
    for (const gene of this.genes) {
      const yellowFormsData = gene.researches?.proteinRegulatesOtherGenes;

      yellowFormsData.forEach((form) => {
        if (typeof form !== undefined) {
          let comment = this.sanitize(form?.comment);
          comment = this.checkBlankValues(comment);
          const doi = this.checkBlankValues(form?.doi);
          const pmid = this.checkBlankValues(form?.pmid);
          const proteinActivity = this.checkBlankValues(form?.proteinActivity);
          const regulationType = this.checkBlankValues(form?.regulationType);
          const regulatedGene = form?.regulatedGene.symbol;

          resulingString =
            resulingString +
            `"${gene.symbol}", "${comment}", "${doi}", "${pmid}", "${proteinActivity}",  "${regulatedGene}", "${regulationType}"\n`;
        }
      });
    }
    return of(resulingString);
  }
}
