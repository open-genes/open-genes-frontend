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
    if (!changes['nodes']?.firstChange || !changes['links']?.firstChange) {
      this.createForceDirectedGraph(this.nodes, this.links);
    }
  }

  private createForceDirectedGraph(nodes, links) {
    const graphContainer = '#main-container';
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.name))
      .force('charge', d3.forceManyBody().distanceMax(80))
      .force('center', d3.forceCenter(1000 / 2, 500 / 2));

    const tooltip = d3
      .select(graphContainer)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('z-index', '10')
      .style('background-color', 'rgba(0, 0, 0, 0.85)')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('visibility', 'hidden');

    const svg = d3
      .select(`#${this.graphSelector}`)
      .attr('width', '1000')
      .attr('height', '600')
      .on('click', (d: any) => this.handleClick(d, tooltip));

    const link = svg
      .append('g')
      .attr('stroke-opacity', 1)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d: any) => (this.grouped ? color(d.group) : 'black'))
      .on('mouseover', function() {
        d3.select(this).style('stroke-width', 4).style('cursor', 'pointer');
      })
      .on('mouseout', function() {
        d3.select(this).style('stroke-width', 1);
      })
      .on('click', (d: any) => this.handleClick(d, tooltip));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', this.grouped ? (d: any) => color(d.group) : color)
      .call(this.drag(simulation))
      .on('mouseover', function () {
        d3.select(this).style('r', 8).style('cursor', 'pointer');
      })
      .on('mouseout', function () {
        d3.select(this).style('r', 5);
      })
      .on('click', (d: any) => this.handleClick(d, tooltip));

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

  private drag(simulation) {
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

    return d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
  }

  private handleClick(d, tooltip) {
    if (d.path[0].nodeName === 'svg') {
      return tooltip.style('visibility', 'hidden');
    }

    if (d.currentTarget.nodeName === 'circle') {
      return tooltip
        .style('top', d.offsetY + 22 + 'px')
        .style('left', d.offsetX - 100 + 'px')
        .style('visibility', 'visible')
        .text(`${d.currentTarget?.textContent}`);
    }

    if (d.currentTarget.nodeName === 'line') {
      const linkData = d.currentTarget.__data__.data;

      if (linkData instanceof Array) {
        const list = linkData.map((data) => {
          return `<li><span>&#8226;</span> ${data.name}</li><br>`;
        });
        const htmlContent = '<ul>' + `${list.join('')}` + '</ul>';
        return tooltip
          .style('top', d.offsetY + 22 + 'px')
          .style('left', d.offsetX - 100 + 'px')
          .style('visibility', 'visible')
          .html(htmlContent);
      }

      if (linkData instanceof Object) {
        const list = Object.keys(linkData).map((key) => {
          return `<li><span>&#8226;</span> ${linkData[key].icdCategoryName}</li><br>`;
        });
        const htmlContent = '<ul>' + `${list.join('')}` + '</ul>';
        return tooltip
          .style('top', d.offsetY + 22 + 'px')
          .style('left', d.offsetX - 100 + 'px')
          .style('visibility', 'visible')
          .html(htmlContent);
      }
    }
  }
}
