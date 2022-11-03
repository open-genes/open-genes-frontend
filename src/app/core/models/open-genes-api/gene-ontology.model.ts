export interface TermsLegacy {
  biological_process: ReadonlyMap<any, string>;
  cellular_component: ReadonlyMap<any, string>;
  molecular_activity: ReadonlyMap<any, string>;
}

export interface Term {
  id: number;
  GOId: string;
  term: string;
}

export interface Terms {
  biological_process: Term[];
  cellular_component: Term[];
  molecular_activity: Term[];
}
