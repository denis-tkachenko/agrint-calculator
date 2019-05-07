import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() text: string
  @Input() classList: string
  @Output() clickEvent = new EventEmitter<string>()

  onClick(event) {
    this.clickEvent.emit(event)
  }

  constructor() { }

  ngOnInit() {
  }

}
