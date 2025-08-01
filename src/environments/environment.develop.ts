import { localesMap } from '../app/core/maps/languages.map';

export const environment = {
  name: 'dev',
  production: false,
  apiUrl: 'https://test.open-genes.com',
  searchApiUrl: 'https://publications-search-api-2yf55.ondigitalocean.app/',
  pubmedUrl: 'https://www.ncbi.nlm.nih.gov/pubmed/',
  proteinAtlasUrl: 'https://www.proteinatlas.org/',
  openLongevity80LevelCMS: 'https://openlongevity.com/',
  wordpressApiUrl: 'https://content.open-genes.com/wp-json/wp/v2/',
  debugMode: false,
  languages: Object.keys(localesMap),
  mockJsonUrl: ['assets/data/articles-page-1.mock.json', 'assets/data/articles-page-2.mock.json'],
  termsJsonUrl: ['assets/i18n/terms-en.json', 'assets/i18n/terms-ru.json'],
  gaTrackingCode: 'G-825YYNSJFC',
  version: '{{VERSION}}',
  build: '{{BUILD_NUMBER}}',
};
