import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../open-genes-api.service';
import { ApiResponse } from '../../../models/api-response.model';
import { Genes } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';

const mockedOptions = {
  objTotal: 480,
  pagination: {
    page: 1,
    pageSize: 20,
    pagesTotal: 24,
  },
};

const mockedGenes = {
  id: 114,
  name: 'Fas cell surface death receptor',
  ncbiId: 355,
  origin: {
    id: null,
    age: '',
    order: null,
    phylum: '',
  },
  symbol: 'FAS',
  aliases: ['ALPS1A', 'APO-1', 'APT1', 'CD95', 'FAS1', 'FASTM', 'TNFRSF6'],
  ensembl: 'ENSG00000026103',
  uniprot: 'TNR6_HUMAN',
  diseases: {
    '160': {
      name: 'Аутоиммунный лимфопролиферативный синдром',
      icdCode: 'D47.9',
      icdName:
        'Новообразование неопределенного или неизвестного характера лимфоидной, кроветворной и родственных им тканей неуточненное',
    },
  },
  timestamp: {
    changed: '1638463685',
    created: '',
  },
  commentCause: [
    {
      id: 9,
      name: 'Возрастные изменения экспрессии гена/активности белка у человека',
    },
  ],
  familyOrigin: {
    id: 24,
    age: '',
    order: 25,
    phylum: '',
  },
  homologueTaxon: 'Euteleostomi',
  proteinClasses: [
    {
      id: 26,
      name: 'CD-маркеры',
    },
    {
      id: 102,
      name: 'Белки, связанные с раком',
    },
    {
      id: 58,
      name: 'Предсказанные мембранные белки',
    },
    {
      id: 118,
      name: 'Гены, связанные с заболеваниями',
    },
    {
      id: 80,
      name: 'Предсказанные секретируемые белки',
    },
    {
      id: 117,
      name: 'Гены-кандидаты, ассоциированные с сердечно-сосудистыми заболеваниями',
    },
  ],
  agingMechanisms: [
    {
      id: 25,
      name: 'нарушения иммунной системы',
    },
    {
      id: 22,
      name: 'нарушения межклеточного взаимодействия',
    },
  ],
  expressionChange: 2,
  diseaseCategories: {
    '685': {
      icdCode: 'D37-D48',
      icdCategoryName: 'Новообразования неопределенного или неизвестного характера',
    },
  },
  functionalClusters: [
    {
      id: 56,
      name: 'апоптоз',
    },
    {
      id: 27,
      name: 'сигналинг',
    },
    {
      id: 5,
      name: 'клеточный цикл',
    },
    {
      id: 4,
      name: 'ответ на стресс',
    },
    {
      id: 10,
      name: 'иммунная функция',
    },
    {
      id: 61,
      name: 'модификация белков',
    },
  ],
  methylationCorrelation: '',
};

describe('ApiServiceTest', () => {
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
    });
    apiService = TestBed.inject(ApiService);
  });

  it('getGenesV2 method should return correct data structure', () => {
    apiService.getGenesV2().subscribe((response: ApiResponse<Genes>) => {
      void expect(response).toContain('items');
      void expect(response).toContain('options');
    });
  });

  it('Subscribed Genes has same keys as mocked Genes', () => {
    apiService.getGenesV2().subscribe((response: ApiResponse<Genes>) => {
      const genes = response.items[0];
      for (const key in mockedGenes) {
        void expect(Object.prototype.hasOwnProperty.call(genes, key)).toBe(true);
      }
    });
  });

  it('getGenesV2 method options have the same structure as subscribed', () => {
    apiService.getGenesV2().subscribe((response: ApiResponse<Genes>) => {
      const options = response.options;
      for (const key in mockedOptions) {
        void expect(Object.prototype.hasOwnProperty.call(options, key)).toBe(true);
      }
    });
  });
});
