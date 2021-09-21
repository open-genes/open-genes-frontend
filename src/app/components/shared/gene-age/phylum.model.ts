export interface Phyla {
  [n: string]: Phylum;
}

export interface Phylum {
  translationString: string;
  name: string;
  age: string;
  order: number;
}
