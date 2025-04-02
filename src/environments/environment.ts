// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'default',
  production: false,
  apiUrl: 'https://open-genes.com',
  searchApiUrl: 'https://publications-search-api-2yf55.ondigitalocean.app/',
  pubmedUrl: 'https://www.ncbi.nlm.nih.gov/pubmed/',
  proteinAtlasUrl: 'https://www.proteinatlas.org/',
  openLongevity80LevelCMS: 'https://openlongevity.com/',
  wordpressApiUrl: 'https://content.open-genes.com/wp-json/wp/v2/',
  debugMode: true,
  languages: ['ru', 'en', 'zh', 'es', 'cs', 'uk', 'pt'],
  mockJsonUrl: ['data/articles-1.json', 'data/articles-2.json'],
  termsJsonUrl: ['assets/i18n/terms-en.json', 'assets/i18n/terms-ru.json'],
  gaTrackingCode: 'G-825YYNSJFC',
  version: '{{VERSION}}',
  build: '{{BUILD_NUMBER}}',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
