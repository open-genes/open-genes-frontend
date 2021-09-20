import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { Gene, Genes } from '../../../../core/models';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DiagramGenes, Link, Node } from '../../models/directed-graph';
import * as d3 from 'd3';

@Component({
  selector: 'app-directed-graph',
  templateUrl: './directed-graph.component.html',
  styleUrls: ['./directed-graph.component.scss'],
})
export class DirectedGraphComponent implements OnInit, OnDestroy {
  private _nodes: Node[];
  private _links: Link[] = [];
  private _destroy$ = new Subject();

  constructor(private _apiService: ApiService) {}

  ngOnInit(): void {
    this._getAllGenes();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _getAllGenes(): void {
    this._apiService
      .getGenes()
      .pipe(
        takeUntil(this._destroy$),
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
        })
      )
      .subscribe((genes) => {
        this._getNodesAndLinksFromGenes(genes);
      });
  }

  private _getNodesAndLinksFromGenes(genes: DiagramGenes[]): void {
    this._nodes = genes.map((gene) => {
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
            this._filteringByFunctionalClusters(gene.functionalClusters, res.functionalClusters)
        )
        .map((res) => {
          return {
            source: gene.name,
            target: res.name,
          };
        });
      this._links.push(...links);
    });

    this._createForceDirectedGraph(this._nodes, this._links);
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

  private _createForceDirectedGraph(nodes, links) {
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('#graphContainer')
      .attr('width', '1000')
      .attr('height', '600');

    const simulation = d3.forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.name)
      )
      .force('charge', d3.forceManyBody().strength(-2))
      .force('center', d3.forceCenter(1000 / 2, 600 / 2));

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', colors)
      .call(this._drag(simulation));

    node.append('title')
      .text((d: any) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    return svg.node();
  }

  private _drag(simulation) {
    function dragStarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }
}
