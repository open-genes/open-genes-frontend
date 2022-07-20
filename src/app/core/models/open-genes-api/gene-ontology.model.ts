export interface TermLegacy {
  object: {
    n: number;
    string;
  };
}

export interface TermsLegacy {
  biological_process: TermLegacy[];
  cellular_component: TermLegacy[];
  molecular_activity: TermLegacy[];
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
