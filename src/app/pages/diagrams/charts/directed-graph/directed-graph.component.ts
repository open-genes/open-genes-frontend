import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Link, Node } from '../../models/directed-graph';
import * as d3 from 'd3';

@Component({
  selector: 'app-directed-graph',
  templateUrl: './directed-graph.component.html',
  styleUrls: ['./directed-graph.component.scss'],
})
export class DirectedGraphComponent implements OnChanges {
  @Input() graphTitle: string;
  @Input() graphSelector: string;
  @Input() grouped: boolean;
  @Input() nodes: Node[];
  @Input() links: Link[];

  public isLoading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['nodes'].firstChange || !changes['links'].firstChange) {
      this._createForceDirectedGraph(this.nodes, this.links);
    }
  }

  private _createForceDirectedGraph(nodes, links) {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(`#${this.graphSelector}`)
      .attr('width', '1000')
      .attr('height', '600');

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.name)
          .distance(30)
      )
      .force('charge', d3.forceManyBody().distanceMax(80))
      .force('center', d3.forceCenter(1000 / 2, 600 / 2));

    const link = svg
      .append('g')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value))
      .attr('stroke', (d: any) => (this.grouped ? color(d.group) : 'black'));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', this.grouped ? (d: any) => color(d.group) : color)
      .call(this._drag(simulation));

    node.append('title').text((d: any) => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
    });

    this.isLoading = false;

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
      if (!event.active) simulation.alphaTarget(0).restart();
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded);
  }
}
