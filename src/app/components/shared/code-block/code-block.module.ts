import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PipesModule } from "src/app/modules/pipes/pipes.module";
import { CodeBlockComponent } from "./code-block.component";

@NgModule({
  declarations: [CodeBlockComponent],
  imports: [CommonModule, PipesModule],
  exports: [CodeBlockComponent],
})
export class CodeBlockModule {}
