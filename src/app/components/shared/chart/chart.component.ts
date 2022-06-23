import {
  AfterViewInit,
  Component,
  Input,
  NgZone, OnInit,
} from '@angular/core';
import { Chart, LinearScale, Tooltip } from 'chart.js';
import { VennDiagramController, ArcSlice } from 'chartjs-chart-venn';
import * as ChartVenn from 'chartjs-chart-venn/build/index.umd.js';
Chart.register(VennDiagramController, ArcSlice, LinearScale);

interface ChartCircle {
  label: string;
  values: any[];
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  @Input() data: ChartCircle[];
  @Input() label: string;

  constructor(
    private zone: NgZone,
  ) {}

  ngOnInit() {
    Chart.register([Tooltip]);
  }

  ngAfterViewInit(): void {
    this.zone.run(() => {
      new Chart('chart', {
        type: 'venn',
        data: ChartVenn.extractSets([...this.data], {
          label: this.label,
        }),
        options: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          borderColor: [
            'rgba(127, 126, 255, 1)',
            'rgba(254, 144, 228, 1)',
            'rgba(126,232, 250, 1)',
            'rgba(144, 251, 222, 1)',
            'rgba(249, 200, 102, 1)',
          ],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          backgroundColor: [
            'rgba(127, 126, 255, .25)',
            'rgba(254, 144, 228, .25)',
            'rgba(126,232, 250, .25)',
            'rgba(144, 251, 222, .25)',
            'rgba(249, 200, 102, .25)',
          ],
        },
        plugins: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          legend: {},
        },
      });
    });
  }
}
