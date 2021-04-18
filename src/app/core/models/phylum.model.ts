export interface Phyla {
  [n: number]: Phylum;
}

export interface Phylum {
  translationString: string;
  name: string;
  age: string;
  order: number;
}
