import { Component, OnInit } from '@angular/core';
import { CanalPlusServiceService } from '../../../services/canal-plus-service.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimeSlice } from 'app/models/TimeSlice';
import { Day } from 'app/models/Day';
import { DatePipe } from '@angular/common';
import { DateColumnComponent } from 'app/components/partials/date-column/date-column.component';
import { HeaderComponent } from '../../partials/header/header.component';
import { reduce } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [DatePipe, DateColumnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  days!: Day[];
  // timeSlices!: TimeSlice[][];

  constructor(
    private canalPlusService: CanalPlusServiceService,
    private sanitizer: DomSanitizer,
  ) {
    this.canalPlusService.daysObservable.subscribe((values) => {
      this.days = values;
      // thsi.timeSlices = values;
      console.log('Home, this.days:', this.days);
    });

    this.canalPlusService.currentChannelObservable.subscribe(
      (currentChannel) => {
        if (currentChannel) {
          this.canalPlusService
            .getWeekDataOfChannel(currentChannel)
            .subscribe((result) => {
              console.log('hodor', result);
              this.days = result;
              // this.timeSlices = result;
            });
        }
      },
    );

    this.canalPlusService.daysObservable.subscribe(
      (values) => (this.days = values),
    );
  }

  getDay(index: number): Date {
    let currentDay = new Date();

    currentDay.setDate(currentDay.getDate() + index);
    return currentDay;
  }

  //  Toute les chaînes
  // https://secure-webtv-static.canal-plus.com/metadata/cpfra/all/v2.2/globalchannels.json
}
