import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Day } from 'app/models/Day';
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

  getDay(index: number): Date {
    let currentDay = new Date();

    currentDay.setDate(currentDay.getDate() + index);
    return currentDay;
  }
}
