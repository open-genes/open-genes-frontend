const urlRoot = `/assets/images/icons/sprites/symbol/`;
const urlGeneral = `${urlRoot}general.sprite.svg`;
const urlNoContent = `${urlRoot}no-content.sprite.svg`;

export const icons: { [id: string]: string } = {
  // General - icons
  cross: urlGeneral,
  delete: urlGeneral,
  // No content - icons
  404: urlNoContent,
  default: urlNoContent,
  language: urlNoContent,
};
