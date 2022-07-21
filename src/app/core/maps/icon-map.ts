const urlRoot = `/assets/images/icons/sprites/symbol/`;
const urlGeneral = `${urlRoot}general.sprite.svg`;
const urlNoContent = `${urlRoot}no-content.sprite.svg`;

export const icons: { [id: string]: string } = {
  // General - icons
  'cross': urlGeneral,
  'book': urlGeneral,
  'delete': urlGeneral,
  'dna': urlGeneral,
  'gene-ontology': urlGeneral,

  // No content - icons
  'error': urlNoContent,
  'default': urlNoContent,
  'file': urlNoContent,
  'language': urlNoContent,
};
