import { DatePipe } from '@angular/common';
import { Component, ElementRef, input } from '@angular/core';
import { ProgramComponent } from '../program/program.component';
import { TimeSlice } from 'app/models/TimeSlice';

@Component({
  selector: 'date-column',
  imports: [DatePipe, ProgramComponent],
  templateUrl: './date-column.component.html',
  styleUrl: './date-column.component.scss',
})
export class DateColumnComponent {
  // day = input<Day>();
  timeSlices = input<TimeSlice[]>();

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  getDay(index: number): Date {
    const currentDay = new Date();

    currentDay.setDate(currentDay.getDate() + index);
    return currentDay;
  }
}
