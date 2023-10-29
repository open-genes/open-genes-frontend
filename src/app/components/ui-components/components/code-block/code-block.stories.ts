import { CommonModule } from '@angular/common';
import { moduleMetadata, Story } from '@storybook/angular';
import { CodeBlockComponent } from './code-block.component';
import { SafePipe } from '../../../../core/pipes/general/safe.pipe';

export default {
  title: 'Example/CodeBlock',
  component: CodeBlockComponent,
  decorators: [
    moduleMetadata({
      declarations: [CodeBlockComponent, SafePipe],
      imports: [CommonModule],
    }),
  ],
};

const Template: Story<CodeBlockComponent> = () => ({
  component: CodeBlockComponent,
  template: `<app-code-block text='<div>{</div>
<div>&nbsp;&nbsp;"id": <var class="number">254</var>,</div>
<div>&nbsp;&nbsp;"ageMya": <var>"1000"</var>,</div>
<div>&nbsp;&nbsp;"agePhylo": <var>"Eumetazoa"</var>,</div>
<div>&nbsp;&nbsp;"symbol": <var>"ADCY5"</var>,</div>
<div>&nbsp;&nbsp;"aliases": [</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var>"AC5"</var></div>
<div>&nbsp;&nbsp;],</div>
<div>&nbsp;&nbsp;"name": <var>"adenylate cyclase 5"</var>,</div>
<div>&nbsp;&nbsp;"ncbiId": <var>"111"</var>,</div>
<div>&nbsp;&nbsp;"uniprot": <var>"ADCY5_HUMAN"</var>,</div>
<div>&nbsp;&nbsp;"commentEvolution": <var>"Adenylyl cyclases are conserved enzymes which were duplicated during evolution [1]."</var>,</div>
<div>&nbsp;&nbsp;"commentFunction": <var>"ADCY5 catalyzes the synthesis of cyclic AMP, are critical regulators of cellular functions. The activity of adenylyl cyclase is stimulated by a range of hormone receptors, primarily via interactions with G-proteins [2]. Type 5 AC (AC5) is 1 of 2 major isoforms in heart, overexpression of AC5 exacerbates the cardiomyopathy induced by chronic catecholamine stress by altering regulation of SIRT1/FoxO3a, MEK/ERK, and MnSOD, resulting in oxidative stress intolerance [3]. AC-cAMP signaling plays crucial roles in normal biological function, for example, lipolysis, gluconeogenesis, respiration and cytoskeletal organization, and its dysregulation in pathophysiological states including memory and neurodegenerative disorders, tumorigenesis, and heart disease [4].","commentCause":["Direct evidence in mammals","Gene involvement in aging-related processes or mechanisms"],"commentAging":"ADCY5 knock-out increases the healthy lifespan of mice by approximately 30 percent [5]. Old AC5 KO mice are also protected from aging-induced cardiomyopathy, e.g., hypertrophy, apoptosis, fibrosis, and reduced cardiac function [6, 7]. Mitochondrial biogenesis, as one of the key factors in longevity, is upregulated in ADCY5 knockout mice [8]."</var>,</div>
<div>&nbsp;&nbsp;"commentCause": [</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var>"Direct evidence in mammals"</var>,</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var>"Gene involvement in aging-related processes or mechanisms"</var></div>
<div>&nbsp;&nbsp;],</div>
<div>&nbsp;&nbsp;"commentAging": <var>"ADCY5 knock-out increases the healthy lifespan of mice by approximately 30 percent [5]. Old AC5 KO mice are also protected from aging-induced cardiomyopathy, e.g., hypertrophy, apoptosis, fibrosis, and reduced cardiac function [6, 7]. Mitochondrial biogenesis, as one of the key factors in longevity, is upregulated in ADCY5 knockout mice [8]."</var>,</div>
<div>&nbsp;&nbsp;"commentsReferenceLinks": {</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var>"10.1124/pr.109.001370": "[1] 10.1124/pr.109.001370"</var>,</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var>"10.1124/mol.115.099556": " <br>[2] 10.1124/mol.115.099556"</var>,</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;<var class="mark">...</var></div>
<div>&nbsp;&nbsp;},</div>
<div>&nbsp;&nbsp;"rating": <var class="null">null</var>,</div>
<div>&nbsp;&nbsp;"functionalClusters": [</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;{</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": <var class="number">11</var>,</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": <var>"mitochondrial function"</var></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;}, {...}</div>
<div>&nbsp;&nbsp;],</div>
<div>&nbsp;&nbsp;"expression": [</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;{</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": <var>"heart"</var>,</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"exp_rpkm": <var>"22.9328"</var></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;}, <var class="mark">{...}</var></div>
<div>&nbsp;&nbsp;],</div>
<div>&nbsp;&nbsp;"expressionChange": <var>4</var></div>
<div>}</div>'> </app-code-block>`,
});
export const Base = Template.bind({});