export interface Term {
  object: {
    id: string;
    comment: string;
  };
}

export interface Terms {
  biological_process: Term;
  cellular_component: Term;
  molecular_activity: Term;
}
