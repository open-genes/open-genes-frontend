import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Gene, Genes } from '../../core/models';
import { DiagramGenes, Link, Node } from './models/directed-graph';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.scss'],
})
export class DiagramsComponent implements OnDestroy {
  public genes: DiagramGenes[];
  public nodes: Node[];
  public links: Link[] = [];
  private _unsubscribe$ = new Subject();

  constructor(
    private _apiService: ApiService
  ) {
    this._getAllGenes();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private _getAllGenes(): void {
    debugger;
    this._apiService
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
        takeUntil(this._unsubscribe$),
      )
      .subscribe((genes) => {
        this._getNodesAndLinksFromGenes(genes);
      });
  }

  private _getNodesAndLinksFromGenes(genes: DiagramGenes[]): void {
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
            this._filteringByDiseaseCategories(gene.diseaseCategories, res.diseaseCategories) &&
            this._filteringByFunctionalClusters(gene.functionalClusters, res.functionalClusters),
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

  private _filteringByDiseaseCategories(gene, res): boolean {
    return Object.keys(gene).some((key) => {
      return Object.prototype.hasOwnProperty.call(res, key);
    });
  }

  private _filteringByFunctionalClusters(gene, res): boolean {
    return gene.some((cluster) => {
      return res.some((res) => res.id === cluster.id);
    });
  }
}
