import { effect, Injectable } from '@angular/core';
import { Hsla } from 'app/models/Hsla';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalService } from './local.service';
import { ColorVariables } from 'app/models/ColorVariables';

export enum DayTime {
  Morning = 'Matin',
  Afternoon = 'Après-midi',
  EarlyEvening = 'Début de soirée',
  Evening = 'Soir',
  Night = 'Nuit',
}

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private colorSubjects = new Map<DayTime, BehaviorSubject<Hsla>>();
  private colorVariables!: ColorVariables;

  constructor(private localService: LocalService) {
    effect(() => {
      this.initColorValues();
    });
  }

  /**
   * Initialize color values from local storage.
   * If the data is available, parse it and update the color subjects.
   */
  initColorValues() {
    const data = this.localService.getData('colorSettingObject');
    if (data) {
      this.colorVariables = JSON.parse(data);
      console.log('data colorVariables', this.colorVariables);

      Object.keys(this.colorVariables).forEach((key) => {
        const dayTimeKey = key as unknown as keyof typeof DayTime;
        const color = this.colorVariables[dayTimeKey] as Hsla;
        const dayTime = DayTime[dayTimeKey];
        this.updateColor(dayTime, color);
      });
    }
  }

  /**
   * Get the color observable for a specific DayTime. If the color subject does not exist, create a new BehaviorSubject with default values.
   * @param dayTime DayTime to get the color observable for
   * @returns Observable of Hsla color
   */
  getColorObservable(dayTime: DayTime): Observable<Hsla> {
    if (!this.colorSubjects.has(dayTime)) {
      this.colorSubjects.set(
        dayTime,
        new BehaviorSubject<Hsla>({
          hue: 0,
          saturation: 0,
          lightness: 0,
          transparency: 0.2,
        }),
      );
    }
    return this.colorSubjects.get(dayTime)!.asObservable();
  }

  /**
   * This method updates the color for a specific DayTime. If the color subject does not exist, it creates a new BehaviorSubject with the provided color.
   * @param dayTime DayTime to update the color for
   * @param color Hsla color to set
   */
  updateColor(dayTime: DayTime, color: Hsla) {
    if (!this.colorSubjects.has(dayTime))
      this.colorSubjects.set(dayTime, new BehaviorSubject<Hsla>(color));
    this.colorSubjects.get(dayTime)!.next(color);
  }

  updateColorComponent(dayTime: DayTime, component: keyof Hsla, value: number) {
    const currentColor = this.colorSubjects.get(dayTime)?.getValue();
    if (!currentColor) return;
    const color = { ...currentColor, [component]: value };
    this.colorSubjects.get(dayTime)!.next(color);
  }
}
