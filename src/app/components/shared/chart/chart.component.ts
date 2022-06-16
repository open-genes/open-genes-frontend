import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Chart, LinearScale } from 'chart.js';
import { VennDiagramController, ArcSlice } from 'chartjs-chart-venn';
import * as ChartVenn from 'chartjs-chart-venn/build/index.umd.js';
Chart.register(VennDiagramController, ArcSlice, LinearScale);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  private data: any;

  constructor(private zone: NgZone) {
    this.data = ChartVenn.extractSets([
      {
        label: 'GHR',
        values: [1, 4, 6, 9],
      },
      {
        label: 'GHRH',
        values: [1, 3, 5, 9],
      },
    ]);
  }

  ngAfterViewInit(): void {
    this.zone.run(() => {
      new Chart('myChart', {
        type: 'venn',
        data: this.data,
        options: {},
      });
    });
  }
}
