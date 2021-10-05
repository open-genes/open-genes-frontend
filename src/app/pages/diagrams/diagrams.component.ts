import { Component, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { DiagramGenes, Link, Node } from './models/directed-graph';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { FunctionalClusters, Gene, Genes } from '../../core/models';
import { AssociatedDiseaseCategories } from '../../core/models/openGenesApi/associated-diseases.model';

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss'],
})
export class DiagramsComponent implements OnDestroy {
  public genes: DiagramGenes[];
  public nodes: Node[];
  public links: Link[] = [];
  public newNodes: Node[];
  public newLinks: Link[];

  private unsubscribe$ = new Subject();

  constructor(private apiService: ApiService) {
    this.getAllGenes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getAllGenes(): void {
    this.apiService
      .getGenes()
      .pipe(
        map((genes: Genes[]) => {
          return genes.map((gene: Gene) => {
            const diagramGenes: DiagramGenes = {
              id: gene.id,
              name: gene.name,
              expressionChange: gene.expressionChange,
              familyOriginId: gene.familyOrigin?.id,
              originId: gene.origin?.id,
              homologueTaxon: gene.homologueTaxon,
              diseaseCategories: gene.diseaseCategories,
              functionalClusters: gene.functionalClusters,
            };
            return diagramGenes;
          });
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((genes) => {
        this.getNodesAndLinksFromGenes(genes);
        this.getNewNodesAndLinks(genes);
      });
  }

  private getNodesAndLinksFromGenes(genes: DiagramGenes[]): void {
    this.nodes = genes.map((gene) => {
      const node: Node = {
        name: gene.name,
      };
      return node;
    });

    genes.forEach((gene) => {
      const links = genes
        .filter(
          (res) =>
            gene.familyOriginId === res.familyOriginId &&
            gene.originId === res.originId &&
            gene.expressionChange === res.expressionChange &&
            gene.homologueTaxon === res.homologueTaxon &&
            this.filteringByDiseaseCategories(gene.diseaseCategories, res.diseaseCategories) &&
            this.filteringByFunctionalClusters(gene.functionalClusters, res.functionalClusters),
        )
        .map((res) => {
          return {
            source: gene.name,
            target: res.name,
          };
        });
      this.links.push(...links);
    });
  }

  private filteringByDiseaseCategories(gene: AssociatedDiseaseCategories, res: AssociatedDiseaseCategories): boolean {
    return Object.keys(gene).some((key) => {
      return Object.prototype.hasOwnProperty.call(res, key);
    });
  }

  private filteringByFunctionalClusters(gene: FunctionalClusters[], res: FunctionalClusters[]): boolean {
    return gene.some((cluster) => {
      return res.some((res) => res.id === cluster.id);
    });
  }

  private getNewNodesAndLinks(genes: DiagramGenes[]): void {
    const groupedDisCatLinks: Link[] = [];
    const groupedFuncClustLinks: Link[] = [];

    genes.forEach((gene) => {
      const diseaseCatLinks = genes
        .filter(
          (res) => gene.id !== res.id &&
            this.groupByDiseaseCategories(gene.diseaseCategories, res.diseaseCategories),
        )
        .map((res) => {
          return {
            id: res.id,
            source: gene.name,
            target: res.name,
            group: 0,
          };
        });

      diseaseCatLinks.forEach((link: Link) => {
        if (groupedDisCatLinks.every((link1) => link1.id !== link.id)) {
          groupedDisCatLinks.push(link);
        }
      });

      const funcClusterLinks = genes
        .filter(
          (res) => gene.id !== res.id &&
            this.groupByFunctionalClusters(gene.functionalClusters, res.functionalClusters),
        )
        .map((res) => {
          return {
            id: res.id,
            source: gene.name,
            target: res.name,
            group: 1,
          };
        });

      funcClusterLinks.forEach((link: Link) => {
        if (groupedFuncClustLinks.every((link2) => link2.id !== link.id)) {
          groupedFuncClustLinks.push(link);
        }
      });
    });

    const groupedDisCatNodes = genes
      .filter((gene) => groupedDisCatLinks.some(({ id }) => gene.id === id))
      .map((res) => {
        return {
          name: res.name,
          group: 0,
        };
      });

    const groupedFuncClustNodes = genes
      .filter((gene) => groupedFuncClustLinks.some(({ id }) => gene.id === id))
      .map((res) => {
        return {
          name: res.name,
          group: 1,
        };
      });

    this.newNodes = groupedDisCatNodes.concat(groupedFuncClustNodes);
    this.newLinks = groupedDisCatLinks.concat(groupedFuncClustLinks);
  }

  private groupByDiseaseCategories(category: AssociatedDiseaseCategories, res: AssociatedDiseaseCategories): boolean {
    const geneKeys = Object.keys(category);
    const resKeys = Object.keys(res);

    return geneKeys.length === resKeys.length &&
      geneKeys.every((key) => resKeys.includes(key));
  }

  private groupByFunctionalClusters(clusters: FunctionalClusters[], res: FunctionalClusters[]): boolean {
    return clusters.length === res.length &&
      clusters.every((cluster) => res.some((res) => res.id === cluster.id));
  }
}
