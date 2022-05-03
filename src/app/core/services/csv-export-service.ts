import { Injectable } from '@angular/core';
import { Genes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  private genes: Genes[]; // TODO: save cached response here
  private maxPageSize = 50000;

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

  public async generateGeneAndGoTermsTable() {
    let items = [];
    let resultingString = '';
    const fetchedItems = await CsvExportService.FetchData('https://open-genes.com/api/gene/symbols', 0, 1, {});
    const resItems = await fetchedItems.json();
    items = resItems.items;
    const csvHeader = '"HGNC", "GO biological process", "GO molecular activity", "GO cellular component"\n';
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const hgnc of items) {
        const n = items.indexOf(hgnc);
        const response = await CsvExportService.FetchData(`https://open-genes.com/api/gene/${hgnc}`, 1000, 3, {});
        const res = await response;

        const resJson = await res.json();
        if (resJson.terms !== undefined && resJson.terms !== null && Object.keys(resJson.terms).length !== 0) {
          const goProcess = this.checkBlankValues(resJson.terms.biological_process);
          const goActivity = this.checkBlankValues(resJson.term.molecular_activity);
          const goComponent = this.checkBlankValues(resJson.term.cellular_component);
          const csvRow = document.createTextNode(`"${hgnc}", "${goProcess}", "${goActivity}", "${goComponent}"\n`);
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          resultingString = resultingString + csvRow;
        } else {
          const csvRow = document.createTextNode(`"${hgnc}", "", "", ""\n`);
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          resultingString = resultingString + csvRow;
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateYellowTable() {
    let resultingString = '';
    const csvHeader = '"HGNC", "comment", "doi", "pmid", "proteinActivity", "regulatedGene", "regulationType"\n';
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `https://open-genes.com/api/research/gene-regulation?pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    if (response) {
      const resJson = await response.json();
      const researches = resJson.items;
      if (researches) {
        for (const form of researches) {
          if (typeof form !== undefined) {
            let comment = this.sanitize(form?.comment);
            comment = this.checkBlankValues(comment);
            const doi = this.checkBlankValues(form?.doi);
            const pmid = this.checkBlankValues(form?.pmid);
            const geneSymbol = this.checkBlankValues(form?.geneSymbol);
            const proteinActivity = this.checkBlankValues(form?.proteinActivity);
            const regulationType = this.checkBlankValues(form?.regulationType);
            const regulatedGene = form?.regulatedGene.symbol;
            resultingString =
              resultingString +
              `"${geneSymbol}", "${comment}", "${doi}", "${pmid}", "${proteinActivity}",  "${regulatedGene}", "${regulationType}"\n`;
          }
        }
        return resultingString;
      }
    }
    return null;
  }
}
