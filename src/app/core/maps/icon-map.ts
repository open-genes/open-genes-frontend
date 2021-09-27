const urlRoot = `/assets/images/icons/sprites/symbol/`;
const urlGeneral = `${urlRoot}general.sprite.svg`;
const urlNoContent = `${urlRoot}no-content.sprite.svg`;

export const icons: { [id: string]: string } = {
  // General - icons
  cross: urlGeneral,
  delete: urlGeneral,
  // No content - icons
  'no-content-404': urlNoContent,
  'no-content-default': urlNoContent,
  'no-content-language': urlNoContent,
};
