export interface Term {
  object: {
    n: number;
    string;
  };
}

export interface Terms {
  biological_process: Term[];
  cellular_component: Term[];
  molecular_activity: Term[];
}
