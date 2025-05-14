import { KeyValuePipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { HslSliderComponent } from 'app/components/tools/hsl-slider/hsl-slider.component';
import { ColorVariables } from 'app/models/ColorVariables';
import { DayTime } from 'app/services/color.service';
import { LocalService } from 'app/services/local.service';

@Component({
  selector: 'settings',
  imports: [HslSliderComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  hue: number = 0.5;
  saturation: number = 0;
  lightness: number = 0;
  transparency: number = 0.2;

  colorVariables!: ColorVariables;

  dayTimes = Object.keys(DayTime).map((key) => ({
    label: key as keyof typeof DayTime,
    value: DayTime[key as keyof typeof DayTime],
  })); // Convert enum keys to an array of objects

  constructor(private localService: LocalService) {
    effect(() => {
      this.initColorValues();
    });
  }

  initColorValues() {
    const data = this.localService.getData('colorSettingObject');
    if (data) {
      this.colorVariables = JSON.parse(data);
    } else {
      this.colorVariables = {
        Morning: { hue: 0.5, saturation: 0, lightness: 0, transparency: 0.2 },
        Afternoon: { hue: 0, saturation: 0, lightness: 0, transparency: 0.2 },
        EarlyEvening: {
          hue: 0.4,
          saturation: 0,
          lightness: 0,
          transparency: 0.2,
        },
        Evening: { hue: 0.3, saturation: 0, lightness: 0, transparency: 0.2 },
        Night: { hue: 0.1, saturation: 0, lightness: 0, transparency: 0.2 },
      };
    }
  }
}
