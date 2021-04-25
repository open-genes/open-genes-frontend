import { Genes } from "./genes.model";

export interface News {
  url: string;
  title: string;
  date: string;
  gene: Genes;
}
