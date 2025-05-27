import {
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CanalPlusServiceService } from '../../../services/canal-plus-service.service';
import { TimeSlice } from 'app/models/TimeSlice';
import { DateColumnComponent } from 'app/components/partials/date-column/date-column.component';
import { Observable } from 'rxjs';

import { DayTime, ColorService } from 'app/services/color.service';
import { Hsla } from 'app/models/Hsla';
import { LocalService } from 'app/services/local.service';
import { ColorVariables } from 'app/models/ColorVariables';
import { ViewportScroller } from '@angular/common';
import { DayTimeService } from 'app/services/day-time.service';

@Component({
  selector: 'app-home',
  imports: [DateColumnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  doubleTimeSlices!: TimeSlice[][];

  hue: number = 360;
  saturation: string = '100%';
  lightness: string = '100%';

  dayTimeColorObservables$!: Map<string, Observable<Hsla>>;

  private activeDayTime = signal<string>('matin');

  private centerRef = viewChild('center', { read: ElementRef });

  private dayColumnRefs = viewChildren(DateColumnComponent, {
    read: ElementRef,
  });

  constructor(
    private canalPlusService: CanalPlusServiceService,
    private elementRef: ElementRef,
    private colorService: ColorService,
    private localService: LocalService,
    private dayTimeService: DayTimeService,
    private viewport: ViewportScroller,
  ) {
    viewport.setOffset([0, 80]);

    effect(() => {
      this.dayTimeColorObservables$ = new Map<DayTime, Observable<Hsla>>();
      this.changeColorSubscription(colorService, elementRef);
    });

    let lastUpdate = 0;
    const throttleDelay = 100;

    // Écouteur d'événements pour le défilement
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastUpdate > throttleDelay) {
        lastUpdate = now;

        this.checkSectionVisibility();
      }
    });

    window.addEventListener('resize', () => {
      this.checkSectionVisibility();
    });

    this.canalPlusService.daysObservable.subscribe((values) => {
      this.doubleTimeSlices = values;
      console.log('Home, this.days:', this.doubleTimeSlices);
    });

    this.canalPlusService.currentChannelObservable.subscribe(
      (currentChannel) => {
        if (currentChannel) {
          this.canalPlusService
            .getWeekDataOfChannel(currentChannel)
            .subscribe((result) => {
              console.log('hodor', result);
              this.doubleTimeSlices = result;
            });
        }
      },
    );

    this.canalPlusService.daysObservable.subscribe(
      (values) => (this.doubleTimeSlices = values),
    );
  }

  private checkSectionVisibility() {
    const center = this.centerRef();
    if (!center) return;
    const centerY = center.nativeElement.getBoundingClientRect().top;

    const sections = this.dayColumnRefs(); // résolu dynamiquement ici
    console.log('[effect] Sections:', sections);
    if (!sections || sections.length === 0) return;

    for (const section of sections) {
      const rect = section.nativeElement.getBoundingClientRect();
      if (rect.top <= centerY && centerY <= rect.bottom) {
        const id = section.nativeElement.id;
        if (id && id !== this.activeDayTime()) {
          this.activeDayTime.set(id);
          console.log('[effect] Section centrée :', id);
          this.dayTimeService.setCurrentSection(id);
        }
        break;
      }
    }
  }

  /**
   * Change la couleur du background des sections grâce aux sliders du composent HslSliderComponent
   * @param colorServ: ColorService
   * @param el: ElementRef
   */
  changeColorSubscription(colorServ: ColorService, el: ElementRef) {
    // for (const dayTime in DayTime) {
    for (const [index, dayTime] of Object.entries(DayTime).entries()) {
      console.log('dayTime:', dayTime);

      this.dayTimeColorObservables$.set(
        dayTime[1],
        colorServ.getColorObservable(
          DayTime[dayTime[0] as keyof typeof DayTime],
        ),
      );

      this.dayTimeColorObservables$.get(dayTime[1])!.subscribe((color) => {
        this.hue = color.hue;

        const colorSettingJson =
          this.localService.getData('colorSettingObject');
        const colorSettingObject: ColorVariables =
          colorSettingJson !== null ? JSON.parse(colorSettingJson) : {};

        el.nativeElement.style.setProperty(`--hue-bg-${index}`, color.hue);
        el.nativeElement.style.setProperty(
          `--sat-bg-${index}`,
          `${color.saturation}%`,
        );
        el.nativeElement.style.setProperty(
          `--light-bg-${index}`,
          `${color.lightness}%`,
        );
        el.nativeElement.style.setProperty(
          `--trans-bg-${index}`,
          color.transparency,
        );

        console.log('dayTime[0]', dayTime[0]);
        const dayTimeKey = dayTime[0] as keyof typeof DayTime;

        const colorVariables: ColorVariables = {
          ...colorSettingObject,
          [dayTimeKey]: {
            hue: color.hue,
            saturation: color.saturation,
            lightness: color.lightness,
            transparency: color.transparency,
          },
        };
        console.log('colorVariables:', colorVariables);

        this.localService.saveData(
          'colorSettingObject',
          JSON.stringify(colorVariables),
        );
      });
    }
  }

  getDay(index: number): Date {
    const currentDay = new Date();

    currentDay.setDate(currentDay.getDate() + index);
    return currentDay;
  }

  getTimeOfDay(index: number): string {
    switch (index) {
      case 0:
        // return 'matin';
        return 'morning';
      case 1:
        // return 'apres-midi';
        return 'afternoon';
      case 2:
        // return 'debut-soiree';
        return 'early-evening';
      case 3:
        // return 'soiree';
        return 'evening';
      case 4:
        // return 'nuit';
        return 'night';
      default:
        return '';
    }
  }
  //  Toute les chaînes
  // https://secure-webtv-static.canal-plus.com/metadata/cpfra/all/v2.2/globalchannels.json
}
