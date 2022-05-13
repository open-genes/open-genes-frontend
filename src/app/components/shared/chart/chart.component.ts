import { Component, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public data = [
    {
      x: [],
      y: [],
      type: 'scatter',
      mode: 'text',
      text: [],
      textfont: {
        color: 'black',
        size: 16,
        family: 'Arial',
      },
    },
  ];

  public layout = {
    responsive: true,
    title: { text: '' },
    xaxis: {
      showticklabels: false,
      autotick: false,
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      showticklabels: false,
      autotick: false,
      showgrid: false,
      zeroline: false,
    },
    shapes: [
      {
        opacity: 0.3,
        xref: 'x',
        yref: 'y',
        fillcolor: 'blue',
        x0: 0,
        y0: 0,
        x1: 2,
        y1: 2,
        type: 'circle',
        line: {
          color: 'blue',
        },
      },
      {
        opacity: 0.3,
        xref: 'x',
        yref: 'y',
        fillcolor: 'gray',
        x0: 1.5,
        y0: 0,
        x1: 3.5,
        y1: 2,
        type: 'circle',
        line: {
          color: 'gray',
        },
      },
    ],
    margin: {
      l: 20,
      r: 20,
      b: 100,
    },
    height: 400,
    width: 480,
  };

  public style = {
    width: '100%',
    height: 'auto',
  };

  @Input() set x(value: any[]) {
    this.data[0].x = value.map((g) => g.symbol);
    console.log('x', this.data[0].x);
    this.cdRef.markForCheck();
  }

  @Input() set y(value: any[]) {
    this.data[0].y = value.map((g) => g.symbol);
    console.log('y', this.data[0].y);
    this.cdRef.markForCheck();
  }

  @Input() set text(value: string[]) {
    this.data[0].text = value ? value : ['A', 'A+B', 'B'];
    console.log(this.data[0].text);
    this.cdRef.markForCheck();
  }

  @Input() set title(value: string) {
    this.layout.title.text = value;
    this.cdRef.markForCheck();
  }

  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;
}
