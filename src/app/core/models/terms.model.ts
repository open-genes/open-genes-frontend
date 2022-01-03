export interface BasicTerm {
  title: string;
  disambiguation: string;
}

export interface AliasTerm {
  alias: string;
}

export type Term = BasicTerm | AliasTerm;

export interface Terms {
  [key: string]: Term;
}
