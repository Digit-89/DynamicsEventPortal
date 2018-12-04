import { Directive, ElementRef, Renderer2, Input, OnInit, Inject } from '@angular/core';
import { LabelsService } from '../services/labels.service';

@Directive({
  selector: '[appTranslate]'
})
export class TranslateDirective implements OnInit {
  @Input() appTranslate: string;

  constructor(private el: ElementRef, private renderer: Renderer2, private labelService: LabelsService) { }

  ngOnInit() {
    this.labelService.getLabelsModel().subscribe(labelsModel => {
      if (labelsModel.labels[this.appTranslate] !== undefined) {
        this.renderer.setProperty(this.el.nativeElement, 'innerText', labelsModel.labels[this.appTranslate]);
      }
    });
  }
}
