import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Genes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  private genes: Genes[];

  static wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  static async FetchData(url, delay, tries, fetchOptions) {
    function onError(err) {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        console.log(err);
      }
      return CsvExportService.wait(delay).then(() => CsvExportService.FetchData(url, delay, triesLeft, fetchOptions));
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

  private async generateSimplePairCsv(csvHeader, field) {
    let resultingString = '';
    // TODO: cache after once made and invalidate on the next session
    const response = await CsvExportService.FetchData(`https://open-genes.com/api/gene/search?pageSize=600`, 0, 1, {});
    if (response) {
      const resJson = await response.json();
      const genes = resJson.items;
      if (genes) {
        resultingString = resultingString + String(csvHeader);
        for (const gene of genes) {
          const items = gene[field].map((d) => `'${d.name}'`);
          const csvRow = `"${gene.symbol}", "${items}"\n`;
          resultingString = resultingString + csvRow;
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateGenesDiseasesTable() {
    return await this.generateSimplePairCsv('"HGNC", "diseases"\n', 'diseases');
  }

  public async generateGenesAgingMechanismsTable() {
    return await this.generateSimplePairCsv('"HGNC", "aging mechanisms"\n', 'agingMechanisms');
  }

  public generateYellowTable() {
    let resultingString = '';
    const csvHeader = '"HGNC", "comment", "doi", "pmid", "proteinActivity", "regulatedGene", "regulationType"\n';
    resultingString = resultingString + csvHeader;
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

          resultingString =
            resultingString +
            `"${gene.symbol}", "${comment}", "${doi}", "${pmid}", "${proteinActivity}",  "${regulatedGene}", "${regulationType}"\n`;
        }
      });
    }
    return of(resultingString);
  }
}
