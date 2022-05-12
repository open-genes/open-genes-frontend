import { Injectable } from '@angular/core';
import { AdditionalInterventionResolver } from '../utils/additional-intervention-resolver';
import { PurpleTable } from '../models/open-genes-api/researches.model';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService extends AdditionalInterventionResolver {
  // private genes: Genes[]; // TODO: save cached response here
  // private researches: any[]; // TODO: add typing from OG-724
  private maxPageSize = 99999;
  constructor() {
    super();
  }

  static wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  static async FetchData(url, delay, tries, fetchOptions) {
    function onError(err) {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        console.warn(err);
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
    const response = await CsvExportService.FetchData(`https://open-genes.com/api/gene/search?pageSize=${this.maxPageSize}`, 0, 1, {});
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

  public async generateGeneTissueRpkmTable() {
    let items = [];
    let resultingString = '';
    const fetchedItems = await CsvExportService.FetchData('https://open-genes.com/api/gene/symbols', 0, 1, {});
    const resItems = await fetchedItems.json();
    items = resItems.items;
    const csvHeader = '"HGNC", "tissue or organ", "rpkm"\n';
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const hgnc of items) {
        const response = await CsvExportService.FetchData(`https://open-genes.com/api/gene/${hgnc}`, 1000, 3, {});
        const res = await response;

        const resJson = await res.json();
        if (resJson.expression.length !== 0) {
          for (const i of resJson.expression) {
            const arrRow = `"${hgnc}", "${i.name}", "${i.exp_rpkm}"\n`;
            resultingString = resultingString + arrRow;
          }
        } else {
          const arrRow = `"${hgnc}", "", ""\n`;
          resultingString = resultingString + arrRow;
        }
      }
      return resultingString;
    }
    return null;
  }

  public async generateGeneAndGoTermsTable() {
    // TODO: DRY
    let items = [];
    let resultingString = '';
    const fetchedItems = await CsvExportService.FetchData('https://open-genes.com/api/gene/symbols', 0, 1, {});
    const resItems = await fetchedItems.json();
    items = resItems.items;
    const csvHeader = '"HGNC", "GO biological process", "GO molecular activity", "GO cellular component"\n';
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const hgnc of items) {
        const response = await CsvExportService.FetchData(`https://open-genes.com/api/gene/${hgnc}`, 1000, 3, {});
        const res = await response;

        const resJson = await res.json();
        if (resJson.terms !== undefined && resJson.terms !== null && Object.keys(resJson.terms).length !== 0) {
          let goProcess = [];
          if (resJson.terms.biological_process?.length !== 0) {
            goProcess = resJson.terms?.biological_process.flatMap((e) => Object.values(e));
          }
          let goActivity = [];
          if (resJson.terms.molecular_activity?.length !== 0) {
            goActivity = resJson.term?.molecular_activity.flatMap((e) => Object.values(e));
          }
          let goComponent = [];
          if (resJson.terms.cellular_component?.length !== 0) {
            goComponent = resJson.terms?.cellular_component.flatMap((e) => Object.values(e));
          }

          const csvRow = `"${hgnc}", "${goProcess}", "${goActivity}", "${goComponent}"\n`;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          resultingString = resultingString + csvRow;
        } else {
          const csvRow = document.createTextNode(`"${hgnc}", "", "", ""\n`);
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          resultingString = resultingString + csvRow;
        }
      }
      return resultingString;
    }
    return null;
  }

  public async generatePinkTable() {
    let resultingString = '';
    const csvHeader =
      '"HGNC", "comment", "doi", "pmid", "dataType", "changeType", "modelOrganism", "allelicVariant", "allelicPolymorphism", "longevityEffect", "sex"\n';
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `https://open-genes.com/api/research/associations-with-lifespan?pageSize=${this.maxPageSize}`,
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
            const dataType = this.checkBlankValues(form?.dataType);
            const changeType = this.checkBlankValues(form?.changeType);
            const modelOrganism = this.checkBlankValues(form?.modelOrganism);
            const allelicVariant = this.checkBlankValues(form?.allelicVariant);
            const allelicPolymorphism = this.checkBlankValues(form?.allelicPolymorphism);
            const longevityEffect = this.checkBlankValues(form?.longevityEffect);
            const sex = this.checkBlankValues(form?.sex);
            resultingString =
              resultingString +
              `${geneSymbol}, "${comment}", ${doi}, ${pmid}, "${dataType}", "${changeType}", "${modelOrganism}", ` +
              `"${allelicVariant}", "${allelicPolymorphism}", "${longevityEffect}", "${sex}"\n`;
          }
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

  public async generatePurpleTable() {
    let resultingString = '';
    const csvHeader = `"HGNC",
    "model organism",
    "sex",
    "line",
    "effect on lifespan",
    "control cohort size",
    "experiment cohort size",
    "quantity of animals in a cage or container",
    "containment temperature (Celcius)",
    "diet",
    "target gene expression change",
    "control lifespan - min",
    "control lifespan - mean",
    "control lifespan - median",
    "control lifespan - max",
    "experiment lifespan - min",
    "experiment lifespan - mean",
    "experiment lifespan - median",
    "experiment lifespan - max",
    "lifespan time unit",
    "lifespan % change - min", 
    "significance",
    "lifespan % change - mean", 
    "significance",
    "lifespan % change - median", 
    "significance",
    "lifespan % change - max", 
    "significance",
    "intervention deteriorates",
    "intervention improves",
    "main effect on lifespan",
    "intervention way",
    "intervention method",
    "genotype",
    "tissue",
    "tissue specific promoter",
    "induction by drug withdrawal",
    "drug",
    "treatment start",
    "treatment end",
    "doi",
    "pmid"\n`;
    resultingString = resultingString + csvHeader;

    // TODO: OG-811
    const response = await CsvExportService.FetchData(
      `https://open-genes.com/api/research/lifespan-change?pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    if (response) {
      const resJson = await response.json();
      const researches: PurpleTable[] = resJson.items;
      if (researches) {
        for (const form of researches) {
          if (typeof form !== undefined) {
            const isNoAdditionalIntervention = this.resolveAdditionalIntervention(form);

            if (isNoAdditionalIntervention === true) {
              const geneSymbol = this.checkBlankValues(form?.geneSymbol);
              const modelOrganism = this.checkBlankValues(form?.modelOrganism);
              const sex = this.checkBlankValues(form?.sex);
              const organismLine = this.checkBlankValues(form?.organismLine);
              const interventionResultForLifespan = this.checkBlankValues(form?.interventionResultForLifespan);
              const controlCohortSize = this.checkBlankValues(form?.controlCohortSize);
              const experimentCohortSize = this.checkBlankValues(form?.experimentCohortSize);
              const populationDensity = this.checkBlankValues(form?.populationDensity);
              const temperatureFrom = this.checkBlankValues(form?.temperatureTo);
              const temperatureTo =
                form?.temperatureTo > form?.temperatureFrom ? this.checkBlankValues(form?.temperatureTo, '–') : '';

              const diet = this.checkBlankValues(form?.diet);
              const expressionChangePercent = this.checkBlankValues(form?.expressionChangePercent);

              const lifespanMinControl = this.checkBlankValues(form?.lifespanMinControl);
              const lifespanMeanControl = this.checkBlankValues(form?.lifespanMeanControl);
              const lifespanMedianControl = this.checkBlankValues(form?.lifespanMedianControl);
              const lifespanMaxControl = this.checkBlankValues(form?.lifespanMaxControl);

              const lifespanMinExperiment = this.checkBlankValues(form?.lifespanMinExperiment);
              const lifespanMeanExperiment = this.checkBlankValues(form?.lifespanMeanExperiment);
              const lifespanMedianExperiment = this.checkBlankValues(form?.lifespanMedianExperiment);
              const lifespanMaxExperiment = this.checkBlankValues(form?.lifespanMaxExperiment);

              const lifespanTimeUnit = this.checkBlankValues(form?.lifespanTimeUnit);

              const lifespanMinChangePercent = this.checkBlankValues(form?.lifespanMinChangePercent);
              const minChangePercentSignificance = this.checkBlankValues(form?.lMinChangeStatSignificance);
              const lifespanMeanChangePercent = this.checkBlankValues(form?.lifespanMeanChangePercent);
              const meanChangePercentSignificance = this.checkBlankValues(form?.lMeanChangeStatSignificance);
              const lifespanMedianChangePercent = this.checkBlankValues(form?.lifespanMedianChangePercent);
              const medianChangePercentSignificance = this.checkBlankValues(form?.lMedianChangeStatSignificance);
              const lifespanMaxChangePercent = this.checkBlankValues(form?.lifespanMaxChangePercent);
              const maxChangePercentSignificance = this.checkBlankValues(form?.lMaxChangeStatSignificance);
              let interventionDeteriorates: string[] | string = [];
              let interventionImproves: string[] | string = [];
              let experimentMainEffect = '';
              let interventionWay = '';
              let interventionMethod = '';
              let genotype = '';
              let inductionByDrugWithdrawal = '';
              const tissues = [];
              const tissueSpecificPromoter = '';
              // Therapy
              let drug = '';
              let treatmentStart = '';
              let treatmentEnd = '';
              let startTimeUnit = '';
              let endTimeUnit = '';

              const generateIntervention = (sample) => {
                experimentMainEffect = this.checkBlankValues(sample.experimentMainEffect);
                interventionWay = this.checkBlankValues(sample.interventionWay);
                interventionMethod = this.checkBlankValues(sample.interventionMethod);
                genotype = this.checkBlankValues(sample.genotype);

                inductionByDrugWithdrawal = this.checkBlankValues(!!sample.inductionByDrugWithdrawal);

                drug = this.checkBlankValues(sample.drug);
                startTimeUnit = this.checkBlankValues(sample.startTimeUnit, '', '', false);
                endTimeUnit = this.checkBlankValues(sample.endTimeUnit, '', '', false);
                treatmentStart = this.checkBlankValues(sample.treatmentStart, '', startTimeUnit);
                treatmentEnd = this.checkBlankValues(sample.treatmentEnd, '', endTimeUnit);

                if (!!sample.tissueSpecific && Array.isArray(sample.tissues)) {
                  for (const tissue of sample.tissues) {
                    tissues.push(tissue.name);
                  }
                }
              };

              if (form?.interventions) {
                for (const sample of form.interventions?.controlAndExperiment) {
                  generateIntervention(sample);
                }

                for (const sample of form.interventions?.experiment) {
                  generateIntervention(sample);
                }
              }

              if (form?.interventionDeteriorates !== undefined && form?.interventionDeteriorates?.length !== 0) {
                for (const i of form.interventionDeteriorates) {
                  interventionDeteriorates.push(i.name);
                }
              } else {
                interventionDeteriorates = this.checkBlankValues(form?.interventionDeteriorates);
              }

              if (form?.interventionImproves !== undefined && form?.interventionImproves?.length !== 0) {
                for (const i of form.interventionImproves) {
                  interventionImproves.push(i.name);
                }
              } else {
                interventionImproves = this.checkBlankValues(form?.interventionImproves);
              }

              // let comment = sanitize(form?.comment);
              // comment = this.checkBlankValues(comment);
              const doi = this.checkBlankValues(form?.doi);
              const pmid = this.checkBlankValues(form?.pmid);
              const csvRow = `"${geneSymbol}", 
            "${modelOrganism}", 
            "${sex}", 
            "${organismLine}", 
            "${interventionResultForLifespan}",  
            "${controlCohortSize}", 
            "${experimentCohortSize}",  
            "${populationDensity}", 
            "${temperatureFrom}${temperatureTo}", 
            "${diet}", 
            "${expressionChangePercent}", 
            "${lifespanMinControl}", 
            "${lifespanMeanControl}", 
            "${lifespanMedianControl}", 
            "${lifespanMaxControl}", 
            "${lifespanMinExperiment}", 
            "${lifespanMeanExperiment}", 
            "${lifespanMedianExperiment}", 
            "${lifespanMaxExperiment}", 
            "${lifespanTimeUnit}",
            "${lifespanMinChangePercent}",
            "${minChangePercentSignificance}",
            "${lifespanMeanChangePercent}",
            "${meanChangePercentSignificance}",
            "${lifespanMedianChangePercent}",
            "${medianChangePercentSignificance}",
            "${lifespanMaxChangePercent}",
            "${maxChangePercentSignificance}",
            "${interventionDeteriorates}", 
            "${interventionImproves}",
            "${experimentMainEffect}",
            "${interventionWay}",
            "${interventionMethod}",
            "${genotype}",
            "${tissues}",
            "${tissueSpecificPromoter}",
            "${inductionByDrugWithdrawal}",
            "${drug}",
            "${treatmentStart}",
            "${treatmentEnd}",
            "${doi}", 
            "${pmid}"\n`;

              resultingString = resultingString + csvRow;
            }
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateGreenTable() {
    let resultingString = '';
    const csvHeader =
      '"HGNC", "comment", "doi", "pmid", "intervention", "model organism", "line", "intervention deteriorates", ' +
      '"intervention improves", "intervention result", "process", "age", "genotype", "sex"\n';
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `https://open-genes.com/api/research/gene-activity-change-impact?pageSize=${this.maxPageSize}`,
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
            const geneSymbol = this.sanitize(form?.geneSymbol);
            let comment = this.sanitize(form?.comment);
            comment = this.checkBlankValues(comment);
            const doi = this.checkBlankValues(form?.doi);
            const pmid = this.checkBlankValues(form?.pmid);
            const geneIntervention = this.checkBlankValues(form?.geneIntervention);
            const modelOrganism = this.checkBlankValues(form?.modelOrganism);
            const organismLine = this.checkBlankValues(form?.organismLine);
            const interventionResult = this.checkBlankValues(form?.interventionResult);
            const vitalProcess = this.checkBlankValues(form?.vitalProcess);
            const age = this.checkBlankValues(form?.age);
            const genotype = this.checkBlankValues(form?.genotype);
            const sex = this.checkBlankValues(form?.sex);
            let interventionDeteriorates: string[] | any = [];
            let interventionImproves: string[] | any = [];

            if (form?.interventionImproves !== undefined && form?.interventionImproves?.length !== 0) {
              for (const i of form.interventionImproves) {
                interventionImproves.push(i.name);
              }
            } else {
              interventionImproves = this.checkBlankValues(form?.interventionImproves);
            }

            if (form?.interventionDeteriorates !== undefined && form?.interventionDeteriorates?.length !== 0) {
              for (const i of form.interventionDeteriorates) {
                interventionDeteriorates.push(i.name);
              }
            } else {
              interventionDeteriorates = this.checkBlankValues(form?.interventionDeteriorates);
            }

            const csvRow =
              `"${geneSymbol}", "${comment}", "${doi}", "${pmid}", "${geneIntervention}",  "${modelOrganism}", ` +
              `"${organismLine}", "${interventionDeteriorates}", "${interventionImproves}", "${interventionResult}", ` +
              `"${vitalProcess}", "${age}", "${genotype}", "${sex}"\n`;
            resultingString = resultingString + csvRow;
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateBlueTable() {
    let resultingString = '';
    const csvHeader =
      '"HGNC", "model organism", line", "sex", "change percentage", "p value", "sample", "age of control - max",' +
      ' "age of experiment - max", "age of control - mean", "age of experiment - mean", "age of control - max", ' +
      '"age of experiment - max", "age unit", "change type", "control cohort size", "experiment cohort size", ' +
      '"statistical method", "expression evaluation by", "measurement method", "comment", "doi", "pmid"\n';
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `https://open-genes.com/api/research/age-related-changes?pageSize=${this.maxPageSize}`,
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
            const geneSymbol = this.sanitize(form?.geneSymbol);
            let comment = this.sanitize(form?.comment);
            comment = this.checkBlankValues(comment);
            const doi = this.checkBlankValues(form?.doi);
            const pmid = this.checkBlankValues(form?.pmid);
            const modelOrganism = this.checkBlankValues(form?.modelOrganism);
            const organismLine = this.checkBlankValues(form?.organismLine);
            const sample = this.checkBlankValues(form?.sample);
            const maxAgeOfControls = this.checkBlankValues(form?.maxAgeOfControls);
            const maxAgeOfExperiment = this.checkBlankValues(form?.maxAgeOfExperiment);
            const meanAgeOfControls = this.checkBlankValues(form?.meanAgeOfControls);
            const meanAgeOfExperiment = this.checkBlankValues(form?.meanAgeOfExperiment);
            const minAgeOfControls = this.checkBlankValues(form?.minAgeOfControls);
            const minAgeOfExperiment = this.checkBlankValues(form?.minAgeOfExperiment);
            const pValue = this.checkBlankValues(form?.pValue);
            const changeType = this.checkBlankValues(form?.changeType);
            const ageUnit = this.checkBlankValues(form?.ageUnit);
            const controlCohortSize = this.checkBlankValues(form?.controlCohortSize);
            const experimentCohortSize = this.checkBlankValues(form?.experimentCohortSize);
            const sex = this.checkBlankValues(form?.sex);
            const value = this.checkBlankValues(form?.value);
            const statisticalMethod = this.checkBlankValues(form?.statisticalMethod);
            const expressionEvaluationBy = this.checkBlankValues(form?.expressionEvaluationBy);
            const measurementMethod = this.checkBlankValues(form?.measurementMethod);
            const csvRow =
              `"${geneSymbol}", ${modelOrganism}", "${organismLine}", "${sex}", "${value}", "${pValue}", ` +
              `"${sample}", "${maxAgeOfControls}", "${maxAgeOfExperiment}", "${meanAgeOfControls}", "${meanAgeOfExperiment}", ` +
              `"${minAgeOfControls}", "${minAgeOfExperiment}", "${ageUnit}", "${changeType}", "${controlCohortSize}", ` +
              `"${experimentCohortSize}", "${statisticalMethod}", "${expressionEvaluationBy}", "${measurementMethod}", "${comment}", "${doi}", "${pmid}"\n`;
            resultingString = resultingString + csvRow;
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateSummarizedResearchResults() {
    let resultingString = '';
    const csvHeader = `"HGNC",
    "research", 
    "criteria",
    "model organism",
    "sex",
    "line",
    "tissue",
    "doi",
    "pmid"\n`;

    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      // TODO: API should give all elements in response with pageSize=1 parameter set
      `https://open-genes.com/api/gene/search?researches=1&pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    if (response) {
      const resJson = await response.json();
      const genes = resJson.items;
      if (genes) {
        for (const gene of genes) {
          const symbol = gene.symbol;

          const purple = gene.researches?.increaseLifespan;
          if (purple) {
            purple?.forEach((form) => {
              // if there is more than one intervention, it's an additional intervention
              const isNoAdditionalIntervention = this.resolveAdditionalIntervention(form);

              if (isNoAdditionalIntervention === true) {
                const doi = this.checkBlankValues(form?.doi);
                const pmid = this.checkBlankValues(form?.pmid);
                const modelOrganism = this.checkBlankValues(form?.modelOrganism);
                const sex = this.checkBlankValues(form?.sex);
                const line = this.checkBlankValues(form?.organismLine);
                const interventionResultForLifespan = this.checkBlankValues(form?.interventionResultForLifespan);
                let experimentMainEffect = '';
                let interventionMethod = '';
                const tissues = [];
                const generateIntervention = (sample) => {
                  experimentMainEffect = this.checkBlankValues(sample.experimentMainEffect);
                  interventionMethod = this.checkBlankValues(sample.interventionMethod);

                  if (!!sample.tissueSpecific && Array.isArray(sample.tissues)) {
                    for (const tissue of sample.tissues) {
                      tissues.push(tissue.name);
                    }
                  }
                };

                if (form?.interventions) {
                  for (const sample of form.interventions?.controlAndExperiment) {
                    generateIntervention(sample);
                  }

                  for (const sample of form.interventions?.experiment) {
                    generateIntervention(sample);
                  }
                }

                const csvRow =
                  `"${symbol}", "Effect of gene activity modulation on lifespan in ${modelOrganism}", ` +
                  `"${experimentMainEffect} (${interventionMethod}) ${interventionResultForLifespan}", ` +
                  `"${modelOrganism}", "${sex}", "${line}", "${tissues}", "${doi}", "${pmid}"\n`;
                resultingString = resultingString + csvRow;
              }
            });
          }

          const blue = gene.researches?.ageRelatedChangesOfGene;
          if (blue) {
            blue?.forEach((form) => {
              if (typeof form !== undefined) {
                const doi = this.checkBlankValues(form?.doi);
                const pmid = this.checkBlankValues(form?.pmid);
                const modelOrganism = this.checkBlankValues(form?.modelOrganism);
                const line = this.checkBlankValues(form?.organismLine);
                const sex = this.checkBlankValues(form?.sex);
                const sample = this.checkBlankValues(form?.sample);
                const changeType = this.checkBlankValues(form?.changeType);
                const expressionEvaluationBy = this.checkBlankValues(form?.expressionEvaluationBy);

                const csvRow =
                  `"${symbol}", "Age-related changes in gene expression or protein activity in ${modelOrganism}", ` +
                  `"${changeType} (expression evaluated by ${expressionEvaluationBy})", "${modelOrganism}", "${sex}", "${line}", "${sample}", "${doi}", "${pmid}"\n`;
                resultingString = resultingString + csvRow;
              }
            });
          }

          // TODO: DRY
          const green = gene.researches?.interventionToGeneImprovesVitalProcesses;
          if (green) {
            green?.forEach((form) => {
              if (typeof form !== undefined) {
                const doi = this.checkBlankValues(form?.doi);
                const pmid = this.checkBlankValues(form?.pmid);
                const modelOrganism = this.checkBlankValues(form?.modelOrganism);
                const sex = this.checkBlankValues(form?.sex);
                const line = this.checkBlankValues(form?.organismLine);
                const geneIntervention = this.checkBlankValues(form?.geneIntervention);
                const result = this.checkBlankValues(form?.result);
                const vitalProcess = this.checkBlankValues(form?.vitalProcess);

                const csvRow =
                  `"${symbol}", "Effect of gene activity modulation on the age-related process in ${modelOrganism}", ` +
                  `"${geneIntervention} caused ${result} in ${vitalProcess}", "${modelOrganism}", "${sex}", "${line}", " ", "${doi}", "${pmid}"\n`;
                resultingString = resultingString + csvRow;
              }
            });
          }

          // TODO: DRY
          const pink = gene.researches?.geneAssociatedWithLongevityEffects;
          if (pink) {
            pink?.forEach((form) => {
              // розовая форма — фенотип + аллельный полиморфизм
              const doi = this.checkBlankValues(form?.doi);
              const pmid = this.checkBlankValues(form?.pmid);
              const longevityEffect = this.checkBlankValues(form?.longevityEffect);
              const modelOrganism = this.checkBlankValues(form?.modelOrganism);
              const allelicPolymorphism = this.checkBlankValues(form?.allelicPolymorphism);
              const sex = this.checkBlankValues(form?.sex);

              const csvRow =
                `"${symbol}", "Genomic, transcriptomic, and proteomic associations with lifespan/age-related phenotype in ${modelOrganism}", ` +
                `"${longevityEffect} of ${allelicPolymorphism}", "${modelOrganism}", "${sex}", " ", " ", "${doi}", "${pmid}"\n`;
              resultingString = resultingString + csvRow;
            });
          }

          // TODO: DRY
          const yellow = gene.researches?.proteinRegulatesOtherGenes;
          if (yellow) {
            yellow?.forEach((form) => {
              const doi = this.checkBlankValues(form?.doi);
              const pmid = this.checkBlankValues(form?.pmid);
              const proteinActivity = this.checkBlankValues(form?.proteinActivity);
              const regulationType = this.checkBlankValues(form?.regulationType);
              const regulatedGene = form?.regulatedGene.symbol;

              const csvRow =
                `"${symbol}", "Involvement of a gene product in the regulation of genes associated with aging", ` +
                `"${proteinActivity} ${regulationType} of ${regulatedGene}", " ", " ", " ", " ", "${doi}", "${pmid}"\n`;
              resultingString = resultingString + csvRow;
            });
          }
        }
        return resultingString;
      }
    }
    return null;
  }
}
