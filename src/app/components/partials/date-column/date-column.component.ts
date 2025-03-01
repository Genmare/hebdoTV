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

@Component({
  selector: 'date-column',
  imports: [ProgramComponent],
  templateUrl: './date-column.component.html',
  styleUrl: './date-column.component.scss',
})
export class DateColumnComponent {
  day = input<Day>();
  // day = input<time>();
}
