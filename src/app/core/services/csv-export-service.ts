import { Injectable } from '@angular/core';
import { AdditionalInterventionResolver } from '../utils/additional-intervention-resolver';
import { PurpleTable } from '../models/open-genes-api/studies.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService extends AdditionalInterventionResolver {
  // private genes: Genes[]; // TODO: save cached response here
  // private studies: any[]; // TODO: add typing from OG-724
  private emptyCellValue = 'n/a';
  private maxPageSize = 0;
  private del = '\t'; // delimiter - tab symbol
  private eol = '\r'; // end of the line
  private apiUrl = environment.apiUrl;

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

  private makeRow(arr: any[]): string {
    return arr.map((i) => `"${i}"`).join(this.del) + this.eol;
  }

  private sanitize(string): string {
    return string;
    // return string.replace(/\t/g, ' ');
  }

  private checkBlankValues(field, prepend = '', append = '', isReplacementValue = true) {
    if (field === undefined || field === null || field === '' || (Array.isArray(field) && field.length === 0)) {
      return isReplacementValue ? this.emptyCellValue : '';
    } else {
      return `${prepend}${field}${append}`;
    }
  }

  private async generateSimplePairCsv(header: string[], field: any, filterFn?: (gene: any) => any) {
    let resultingString = '';
    const response = await CsvExportService.FetchData(
      `${(this.apiUrl)}/api/gene/search?pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    if (response) {
      const resJson = await response.json();
      const genes = resJson.items;
      if (genes) {
        const csvHeader = `"${header.join(this.del)}"${this.eol}`;
        resultingString = resultingString + String(csvHeader);
        let items;
        for (const gene of genes) {
          if (filterFn) {
            items = filterFn(gene);
          } else {
            items = gene[field].map((d) => `'${d.name}'`);
          }
          const csvRow = `"${gene.symbol}"${this.del}"${items}"${this.eol}`;
          resultingString = resultingString + csvRow;
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateGenesDiseasesTable() {
    return await this.generateSimplePairCsv(["hgnc", "diseases"], 'diseases');
  }

  public async generateGenesConfidenceLevelTable() {
    return await this.generateSimplePairCsv(["hgnc", "confidence_level"], 'confidenceLevel', (g) => {
      return g.confidenceLevel.name;
    });
  }

  public async generateGenesAgingMechanismsTable() {
    return await this.generateSimplePairCsv(["hgnc", "hallmarks_of_aging"], 'agingMechanisms', (g) => {
      // Filter duplicates from backend
      const mappedMechanisms = new Map();
      g.agingMechanisms.forEach((e) => {
        mappedMechanisms.set(e.id, e.name);
      });
      return Array.from(mappedMechanisms).map((i) => `'${i[1]}'`);
    });
  }

  public async generateGeneTissueRpkmTable() {
    let items = [];
    let resultingString = '';
    const fetchedItems = await CsvExportService.FetchData(`${this.apiUrl}/api/gene/symbols`, 0, 1, {});
    const resItems = await fetchedItems.json();
    items = resItems.map((gene) => gene.symbol);
    const csvHeader = this.makeRow(['hgnc', 'tissue_or_organ', 'rpkm']);
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const hgnc of items) {
        const response = await CsvExportService.FetchData(`${this.apiUrl}/api/gene/${hgnc}`, 1000, 3, {});
        const res = await response;

        const resJson = await res.json();
        if (resJson.expression.length !== 0) {
          for (const i of resJson.expression) {
            const arrRow = this.makeRow([i.hgnc, i.name, i.exp_rpkm]);
            resultingString = resultingString + arrRow;
          }
        } else {
          const arrRow = this.makeRow([hgnc, '', '']);
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
    const fetchedItems = await CsvExportService.FetchData(`${this.apiUrl}/api/gene/symbols`, 0, 1, {});
    const resItems = await fetchedItems.json();
    items = resItems.map((gene) => gene.symbol);
    const csvHeader = this.makeRow(['hgnc', 'go_biological_process', 'go_molecular_activity', 'go_cellular_component']);
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const hgnc of items) {
        const response = await CsvExportService.FetchData(`${this.apiUrl}/api/gene/${hgnc}`, 1000, 3, {});
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

          const csvRow = this.makeRow([hgnc, goProcess, goActivity, goComponent]);
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          resultingString = resultingString + csvRow;
        } else {
          const csvRow = this.makeRow([hgnc, '', '', '']);
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
    const csvHeader = this.makeRow([
      'hgnc',
      'polymorphism_type',
      'polymorphism_id',
      'nucleotide_substitution',
      'amino_acid_substitution',
      'polymorphism_other',
      'effect',
      'association_type',
      'significance',
      'p_value',
      'change_type',
      'control_cohort_size',
      'experiment_cohort_size',
      'control_lifespan_min',
      'control_lifespan_mean',
      'control_lifespan_max',
      'experiment_lifespan_min',
      'experiment_lifespan_mean',
      'experiment_lifespan_max',
      'ethnicity',
      'associated_allele',
      'non-associated_allele',
      'allelic_frequency_controls',
      'allelic_frequency_experiment',
      'study_type',
      'sex',
      'doi',
      'pmid',
      'comment',
    ]);
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/research/associations-with-lifespan?pageSize=${this.maxPageSize}`,
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
            const polymorphismType = this.checkBlankValues(form?.polymorphismType);
            const polymorphismId = this.checkBlankValues(form?.polymorphismId);
            const nucleotideChange = this.checkBlankValues(form?.nucleotideChange);
            const aminoAcidChange = this.checkBlankValues(form?.aminoAcidChange);
            const polymorphismOther  = this.checkBlankValues(form?.polymorphismOther);
            const longevityEffect = this.checkBlankValues(form?.longevityEffect);
            const dataType = this.checkBlankValues(form?.dataType);
            const significance = this.checkBlankValues(form?.significance);
            const pValue = this.checkBlankValues(form?.pValue);
            const changeType = this.checkBlankValues(form?.changeType);
            const nOfControls  = this.checkBlankValues(form?.nOfControls);
            const nOfExperiment = this.checkBlankValues(form?.nOfExperiment);
            const minAgeOfControls = this.checkBlankValues(form?.minAgeOfControls);
            const meanAgeOfControls = this.checkBlankValues(form?.meanAgeOfControls);
            const maxAgeOfControls = this.checkBlankValues(form?.maxAgeOfControls);
            const minAgeOfExperiment = this.checkBlankValues(form?.minAgeOfExperiment);
            const meanAgeOfExperiment = this.checkBlankValues(form?.meanAgeOfExperiment);
            const maxAgeOfExperiment = this.checkBlankValues(form?.maxAgeOfExperiment);
            const ethnicity = this.checkBlankValues(form?.ethnicity);
            const associatedAllele = this.checkBlankValues(form?.associatedAllele);
            const nonAssociatedAllele = this.checkBlankValues(form?.nonAssociatedAllele);
            const frequencyControls = this.checkBlankValues(form?.frequencyControls, '', '%');
            const frequencyExperiment = this.checkBlankValues(form?.frequencyExperiment, '', '%');
            const studyType = this.checkBlankValues(form?.studyType);
            const sex = this.checkBlankValues(form?.sex);

            const row = this.makeRow([
              geneSymbol,
              polymorphismType,
              polymorphismId,
              nucleotideChange,
              aminoAcidChange,
              polymorphismOther,
              dataType,
              longevityEffect,
              significance,
              pValue,
              changeType,
              nOfControls,
              nOfExperiment,
              minAgeOfControls,
              meanAgeOfControls,
              maxAgeOfControls,
              minAgeOfExperiment,
              meanAgeOfExperiment,
              maxAgeOfExperiment,
              ethnicity,
              associatedAllele,
              nonAssociatedAllele,
              frequencyControls,
              frequencyExperiment,
              studyType,
              sex,
              doi,
              pmid,
              comment,
            ]);
            resultingString = resultingString + row;
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateYellowTable() {
    let resultingString = '';
    const csvHeader = this.makeRow([
      'hgnc',
      'comment',
      'doi',
      'pmid',
      'protein_activity',
      'regulated_gene',
      'regulation_type',
    ]);
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/research/gene-regulation?pageSize=${this.maxPageSize}`,
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

            const row = this.makeRow([geneSymbol, comment, doi, pmid, proteinActivity, regulatedGene, regulationType]);
            resultingString = resultingString + row;
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generatePurpleTable() {
    let resultingString = '';
    const csvHeader = this.makeRow([
      'hgnc',
      'model_organism',
      'sex',
      'line',
      'effect_on_lifespan',
      'control_cohort_size',
      'experiment_cohort_size',
      'quantity_of_animals_in_cage_or_container',
      'containment_t_celsius_from',
      'containment_t_celsius_to',
      'diet',
      'target_gene_expression_change',
      'control_lifespan_min',
      'control_lifespan_mean',
      'control_lifespan_median',
      'control_lifespan_max',
      'experiment_lifespan_min',
      'experiment_lifespan_mean',
      'experiment_lifespan_median',
      'experiment_lifespan_max',
      'lifespan_time_unit',
      'lifespan_%_change_min',
      'significance_min',
      'lifespan_%_change_mean',
      'significance_mean',
      'lifespan_%_change_median',
      'significance_median',
      'lifespan_%_change_max',
      'significance_max',
      'intervention_deteriorates',
      'intervention_improves',
      'main_effect_on_lifespan',
      'intervention_way',
      'intervention_method',
      'genotype',
      'tissue',
      'promoter_or_driver',
      'induction_by_drug_withdrawal',
      'drug',
      'treatment_start',
      'treatment_end',
      'doi',
      'pmid',
    ]);
    resultingString = resultingString + csvHeader;

    // TODO: OG-811
    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/research/lifespan-change?pageSize=${this.maxPageSize}`,
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
              let tissueSpecificPromoter = '';
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
                tissueSpecificPromoter = this.checkBlankValues(sample.tissueSpecificPromoter);

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
              const csvRow = this.makeRow([
                geneSymbol,
                modelOrganism,
                sex,
                organismLine,
                interventionResultForLifespan,
                controlCohortSize,
                experimentCohortSize,
                populationDensity,
                temperatureFrom,
                temperatureTo,
                diet,
                expressionChangePercent,
                lifespanMinControl,
                lifespanMeanControl,
                lifespanMedianControl,
                lifespanMaxControl,
                lifespanMinExperiment,
                lifespanMeanExperiment,
                lifespanMedianExperiment,
                lifespanMaxExperiment,
                lifespanTimeUnit,
                lifespanMinChangePercent,
                minChangePercentSignificance,
                lifespanMeanChangePercent,
                meanChangePercentSignificance,
                lifespanMedianChangePercent,
                medianChangePercentSignificance,
                lifespanMaxChangePercent,
                maxChangePercentSignificance,
                interventionDeteriorates,
                interventionImproves,
                experimentMainEffect,
                interventionWay,
                interventionMethod,
                genotype,
                tissues,
                tissueSpecificPromoter,
                inductionByDrugWithdrawal,
                drug,
                treatmentStart,
                treatmentEnd,
                doi,
                pmid,
              ]);
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
    const csvHeader = this.makeRow([
      'hgnc',
      'comment',
      'doi',
      'pmid',
      'intervention',
      'model_organism',
      'line',
      'intervention_deteriorates',
      'intervention_improves',
      'intervention_result',
      'process',
      'age',
      'genotype',
      'sex',
    ]);
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/research/gene-activity-change-impact?pageSize=${this.maxPageSize}`,
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

            const csvRow = this.makeRow([
              geneSymbol,
              comment,
              doi,
              pmid,
              geneIntervention,
              modelOrganism,
              organismLine,
              interventionDeteriorates,
              interventionImproves,
              interventionResult,
              vitalProcess,
              age,
              genotype,
              sex,
            ]);
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
    const csvHeader = this.makeRow([
      'hgnc',
      'model_organism',
      'line',
      'sex',
      'change_percentage',
      'p_value',
      'sample',
      'age_of_control_min',
      'age_of_control_mean',
      'age_of_control_max',
      'age_of_experiment_min',
      'age_of_experiment_mean',
      'age_of_experiment_max',
      'age_unit',
      'change_type',
      'control_cohort_size',
      'experiment_cohort_size',
      'statistical_method',
      'expression_evaluation_by',
      'measurement_method',
      'comment',
      'doi',
      'pmid',
    ]);
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/research/age-related-changes?pageSize=${this.maxPageSize}`,
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
            const csvRow = this.makeRow([
              geneSymbol,
              modelOrganism,
              organismLine,
              sex,
              value,
              pValue,
              sample,
              minAgeOfControls,
              meanAgeOfControls,
              maxAgeOfControls,
              minAgeOfExperiment,
              meanAgeOfExperiment,
              maxAgeOfExperiment,
              ageUnit,
              changeType,
              controlCohortSize,
              experimentCohortSize,
              statisticalMethod,
              expressionEvaluationBy,
              measurementMethod,
              comment,
              doi,
              pmid,
            ]);
            resultingString = resultingString + csvRow;
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateGeneCriteriaTable() {
    let resultingString = '';
    const csvHeader = this.makeRow([
      'hgnc',
      'criteria',
    ]);
    resultingString = resultingString + csvHeader;
    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/gene/search?pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    if (response) {
      const resJson = await response.json();
      const genes = resJson.items;
      if (genes) {
        resultingString = resultingString + String(csvHeader);
        let items;
        for (const gene of genes) {
          items = gene.commentCause.map((d) => `'${d.name}'`);
          for (const item of items) {
            const csvRow = `"${gene.symbol}"${this.del}"${item}"${this.eol}`;
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
    const csvHeader = this.makeRow([
      'hgnc',
      'research',
      'criteria',
      'model_organism',
      'sex',
      'line',
      'tissue',
      'doi',
      'pmid',
    ]);
    resultingString = resultingString + csvHeader;

    const response = await CsvExportService.FetchData(
      `${this.apiUrl}/api/gene/search?researches=1&pageSize=${this.maxPageSize}`,
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
                  `"${symbol}"${this.del}"Effect of gene activity modulation on lifespan in ${modelOrganism}"${this.del}` +
                  `"${experimentMainEffect} (${interventionMethod}) ${interventionResultForLifespan}"${this.del}` +
                  this.makeRow([modelOrganism, sex, line, tissues, doi, pmid]);
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
                  `"${symbol}"${this.del}"Age-related changes in gene expression or protein activity in ${modelOrganism}"${this.del}` +
                  `"${changeType} (expression evaluated by ${expressionEvaluationBy})"${this.del}` +
                  this.makeRow([modelOrganism, sex, line, sample, doi, pmid]);
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
                  `"${symbol}"${this.del}"Effect of gene activity modulation on the age-related process in ${modelOrganism}"${this.del}` +
                  `"${geneIntervention} caused ${result} in ${vitalProcess}"${this.del}` +
                  this.makeRow([modelOrganism, sex, line, ' ', doi, pmid]);
                resultingString = resultingString + csvRow;
              }
            });
          }

          // TODO: DRY
          const pink = gene.researches?.geneAssociatedWithLongevityEffects;
          if (pink) {
            pink?.forEach((form) => {
              // pink — phenotype + allelic polymorphism
              const doi = this.checkBlankValues(form?.doi);
              const pmid = this.checkBlankValues(form?.pmid);
              const longevityEffect = this.checkBlankValues(form?.longevityEffect);
              const modelOrganism = this.checkBlankValues(form?.modelOrganism);
              const allelicPolymorphism = this.checkBlankValues(form?.allelicPolymorphism);
              const sex = this.checkBlankValues(form?.sex);

              const csvRow =
                `"${symbol}"${this.del}"Genomic, transcriptomic, and proteomic associations with lifespan/age-related phenotype in ${modelOrganism}"${this.del}` +
                `"${longevityEffect} of ${allelicPolymorphism}", "${modelOrganism}"${this.del}` +
                this.makeRow([sex, ' ', ' ', doi, pmid]);
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
                `"${symbol}"${this.del}"Involvement of a gene product in the regulation of genes associated with aging"${this.del}` +
                `"${proteinActivity} ${regulationType} of ${regulatedGene}"${this.del}` +
                this.makeRow([' ', ' ', ' ', ' ', doi, pmid]);
              resultingString = resultingString + csvRow;
            });
          }
        }
        return resultingString;
      }
    }
    return null;
  }

  public async generateGeneEvolutionTable() {
    let items = [];
    let resultingString = '';
    const fetchedItems = await CsvExportService.FetchData(
      `${this.apiUrl}/api/gene/search?pageSize=${this.maxPageSize}`,
      0,
      1,
      {}
    );
    const resItems = await fetchedItems.json();
    items = resItems.items;
    const csvHeader = this.makeRow(['hgnc', 'gene_origin', 'gene_family_origin', 'conservative_in']);
    resultingString = resultingString + csvHeader;

    if (items.length !== 0) {
      for (const gene of items) {
        const origin = this.checkBlankValues(gene.origin?.phylum);
        const familyOrigin = this.checkBlankValues(gene.familyOrigin?.phylum);
        const conservativeIn = this.checkBlankValues(gene.homologueTaxon);
        const arrRow = this.makeRow([gene.symbol, origin, familyOrigin, conservativeIn]);
        resultingString = resultingString + arrRow;
      }
      return resultingString;
    }
    return null;
  }
}
