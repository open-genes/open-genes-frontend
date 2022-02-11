import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../open-genes-api.service';
import { ApiResponse } from '../../../models/api-response.model';
import { Genes } from '../../../models';
import { TranslateModule } from '@ngx-translate/core';
import mockedData from '../open-genes-api/api-gene-search-mock.json';

const mockedOptions = mockedData.options;
const mockedGenes = mockedData.items;

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
