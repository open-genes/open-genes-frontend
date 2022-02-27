import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMatSearchInput]',
  exportAs: 'MatSearchInputDirective',
})
export class MatSearchInputDirective implements OnInit {
  constructor(
    private readonly element: ElementRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    console.log('MatSearchInputDirective constructor');
  }

  ngOnInit(): void {
    console.log('MatSearchInputDirective OnInit');
    this.moveInputOutsideScrollingContainer();
  }

  moveInputOutsideScrollingContainer(): void {
    const matPanel = this.elementRef.nativeElement.parentNode.parentNode;
    this.elementRef.nativeElement.appendTo(matPanel);
    this.renderer.appendChild(this.elementRef.nativeElement.parentNode, matPanel);
    console.log('moveInputOutsideScrollingContainer: ', matPanel, this.elementRef);
  }
}
