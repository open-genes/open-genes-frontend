import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { DiagramGenes, Link, Node } from './models/directed-graph.model';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { AgeRelatedProcesses, Genes } from '../../core/models';
import { AssociatedDiseaseCategories } from '../../core/models/open-genes-api/associated-diseases.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public nNodes: Node[];
  public nLinks: Link[];

  private currentLang: string;
  private unsubscribe$ = new Subject();

  constructor(
    private apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;
    this.getAllGenes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getAllGenes(): void {
    this.http
      .get<ApiResponse<Genes>>(`/api/gene/search?lang=${this.currentLang}&pageSize=500`)
      .pipe(
        map((filteredGenes) => {
          return filteredGenes.items.map((gene: Genes) => {
            const diagramGenes: DiagramGenes = {
              id: gene.id,
              symbol: gene.symbol,
              expressionChange: gene.expressionChange,
              familyOrigin: gene.familyOrigin,
              originId: gene.origin?.id,
              homologueTaxon: gene.homologueTaxon,
              diseaseCategories: gene.diseaseCategories,
              functionalClusters: gene.functionalClusters,
            };
            return diagramGenes;
          });
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((genes) => {
        this.getNodesAndLinksFromGenes(genes);
        this.getNewNodesAndLinks(genes);
        this.cdRef.markForCheck();
      });
  }

  onTabClick() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.getAllGenes();
    this.cdRef.markForCheck();
  }

  private getNodesAndLinksFromGenes(genes: DiagramGenes[]): void {
    this.nodes = genes.map((gene) => {
      const node: Node = {
        symbol: gene.symbol,
      };
      return node;
    });

    genes.forEach((gene) => {
      const links = genes
        .filter(
          (res) =>
            gene.familyOrigin?.id === res.familyOrigin?.id &&
            gene.originId === res.originId &&
            gene.expressionChange === res.expressionChange &&
            gene.homologueTaxon === res.homologueTaxon &&
            this.filteringByDiseaseCategories(gene.diseaseCategories, res.diseaseCategories) &&
            this.filteringByFunctionalClusters(gene.functionalClusters, res.functionalClusters)
        )
        .map((res) => {
          return {
            source: gene.symbol,
            target: res.symbol,
          };
        });
      this.links.push(...links);
    });
  }

  private filteringByDiseaseCategories(
    gene: AssociatedDiseaseCategories[],
    res: AssociatedDiseaseCategories[]
  ): boolean {
    return gene.some((disease) => {
      return res.some((res) => res.id === disease.id);
    });
  }

  private filteringByFunctionalClusters(gene: AgeRelatedProcesses[], res: AgeRelatedProcesses[]): boolean {
    return gene.some((cluster) => {
      return res.some((res) => res.id === cluster.id);
    });
  }

  private getNewNodesAndLinks(genes: DiagramGenes[]): void {
    const groupedDisCatLinks: Link[] = [];
    const groupedFuncClustLinks: Link[] = [];
    const groupedFamOriginLinks: Link[] = [];

    genes.forEach((gene) => {
      const diseaseCatLinks = genes
        .filter(
          (res) => gene.id !== res.id && this.groupByDiseaseCategories(gene.diseaseCategories, res.diseaseCategories)
        )
        .map((res) => {
          return {
            id: res.id,
            source: gene.symbol,
            target: res.symbol,
            group: 0,
            data: gene.diseaseCategories,
          } as Link;
        });

      diseaseCatLinks.forEach((link: Link) => {
        if (groupedDisCatLinks.every((link1) => link1.id !== link.id)) {
          groupedDisCatLinks.push(link);
        }
      });
      const funcClusterLinks = genes
        .filter(
          (res) => gene.id !== res.id && this.groupByFunctionalClusters(gene.functionalClusters, res.functionalClusters)
        )
        .map((res) => {
          return {
            id: res.id,
            source: gene.symbol,
            target: res.symbol,
            group: 1,
            data: gene.functionalClusters,
          } as Link;
        });

      funcClusterLinks.forEach((link: Link) => {
        if (groupedFuncClustLinks.every((link2) => link2.id !== link.id)) {
          groupedFuncClustLinks.push(link);
        }
      });

      const familyOriginLinks = genes
        .filter((res) => gene.id !== res.id && gene.familyOrigin?.id && gene.familyOrigin?.id === res.familyOrigin?.id)
        .map((res) => {
          return {
            id: res.id,
            source: gene.symbol,
            target: res.symbol,
            group: 2,
            data: [{ symbol: gene.familyOrigin?.phylum }],
          } as Link;
        });

      familyOriginLinks.forEach((link: Link) => {
        if (groupedFamOriginLinks.every((link3) => link3.id !== link.id)) {
          groupedFamOriginLinks.push(link);
        }
      });
    });

    const groupedDisCatNodes = genes
      .filter((gene) => groupedDisCatLinks.some(({ id }) => gene.id === id))
      .map((res) => {
        return {
          id: res.id,
          symbol: res.symbol,
          group: 0,
        };
      });

    // TODO: rename Functional clusters to Age-related processes
    const groupedFuncClustNodes = genes
      .filter((gene) => groupedFuncClustLinks.some(({ id }) => gene.id === id))
      .map((res) => {
        return {
          id: res.id,
          symbol: res.symbol,
          group: 1,
        };
      });

    const groupedFamOriginNodes = genes
      .filter((gene) => groupedFamOriginLinks.some(({ id }) => gene.id === id))
      .map((res) => {
        return {
          id: res.id,
          symbol: res.symbol,
          group: 2,
        };
      });

    this.newNodes = groupedFuncClustNodes
      .concat(groupedDisCatNodes)
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    this.newLinks = groupedDisCatLinks.concat(groupedFuncClustLinks);

    this.nNodes = groupedFuncClustNodes
      .concat(groupedFamOriginNodes)
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    this.nLinks = groupedFamOriginLinks.concat(groupedFuncClustLinks);
  }

  private groupByDiseaseCategories(
    diseases: AssociatedDiseaseCategories[],
    res: AssociatedDiseaseCategories[]
  ): boolean {
    return (
      diseases.length &&
      diseases.length === res.length &&
      diseases.every((disease) => res.some((res) => res.id === disease.id))
    );
  }

  private groupByFunctionalClusters(clusters: AgeRelatedProcesses[], res: AgeRelatedProcesses[]): boolean {
    return (
      clusters.length &&
      clusters.length === res.length &&
      clusters.every((cluster) => res.some((res) => res.id === cluster.id))
    );
  }
}
