export interface Term {
  object: {
    id: number;
    comment: string;
  };
}

export interface Terms {
  biological_process: Term;
  cellular_component: Term;
  molecular_activity: Term;
}
