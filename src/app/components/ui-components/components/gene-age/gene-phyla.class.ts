import { Phyla, Phylum } from '../../../../core/models/phylum.model';

export abstract class GenePhylaClass {
  // TODO: Discuss with backend if we can have it as a dictionary
  protected phyla: Phyla = {
    1: {
      translationString: 'phylum_chordata',
      name: 'Chordata',
      age: '580',
      order: 8,
    },
    2: {
      translationString: 'phylum_eukaryota',
      name: 'Eukaryota',
      age: '1000–1900',
      order: 2,
    },
    3: {
      translationString: 'phylum_eumetazoa',
      name: 'Eumetazoa',
      age: '800',
      order: 5,
    },
    4: {
      translationString: 'phylum_euteleostomi',
      name: 'Euteleostomi',
      age: '420',
      order: 13,
    },
    5: {
      translationString: 'phylum_mammalia',
      name: 'Mammalia',
      age: '190',
      order: 18,
    },
    6: {
      translationString: 'phylum_opisthokonta',
      name: 'Opisthokonta',
      age: '900–1100',
      order: 3,
    },
    8: {
      translationString: 'phylum_procaryota',
      name: 'Procaryota',
      age: '3000–3500',
      order: 1,
    },
    9: {
      translationString: 'phylum_vertebrata',
      name: 'Vertebrata',
      age: '490',
      order: 10,
    },
    10: {
      translationString: 'phylum_metazoa',
      name: 'Metazoa',
      age: '800–900',
      order: 4,
    },
    11: {
      translationString: 'phylum_bilateria',
      name: 'Bilateria',
      age: '700–800',
      order: 6,
    },
    12: {
      translationString: 'phylum_deuterostomia',
      name: 'Deuterostomia',
      age: '650–700',
      order: 7,
    },
    13: {
      translationString: 'phylum_craniata',
      name: 'Craniata',
      age: null,
      order: 9,
    },
    14: {
      translationString: 'phylum_gnathostomata',
      name: 'Gnathostomata',
      age: '440',
      order: 11,
    },
    15: {
      translationString: 'phylum_sarcopterygii',
      name: 'Sarcopterygii',
      age: null,
      order: 14,
    },
    16: {
      translationString: 'phylum_dipnotetrapodomorpha',
      name: 'Dipnotetrapodomorpha',
      age: null,
      order: 15,
    },
    17: {
      translationString: 'phylum_tetrapoda',
      name: 'Tetrapoda',
      age: '350',
      order: 16,
    },
    18: {
      translationString: 'phylum_amniota',
      name: 'Amniota',
      age: '310',
      order: 17,
    },
    19: {
      translationString: 'phylum_theria',
      name: 'Theria',
      age: '150',
      order: 19,
    },
    20: {
      translationString: 'phylum_eutheria',
      name: 'Eutheria',
      age: null,
      order: 20,
    },
    21: {
      translationString: 'phylum_boreoeutheria',
      name: 'Boreoeutheria',
      age: null,
      order: 221,
    },
    22: {
      translationString: 'phylum_euarchontoglires',
      name: 'Euarchontoglires',
      age: null,
      order: 22,
    },
    23: {
      translationString: 'phylum_primatibus',
      name: 'Primatibus',
      age: null,
      order: 23,
    },
    24: {
      translationString: 'phylum_not_specified',
      name: '-',
      age: null,
      order: 24,
    },
  }

  protected getPhylumDataByID(phylumID: number): Phylum {
    return this.phyla[phylumID];
  }

  protected getPhylumDataByName(phylumName: string): Phylum {
    for (const [key, value] of Object.entries(this.phyla)) {
        if (value.name === phylumName) {
          return value;
        }
    }
  }
}
