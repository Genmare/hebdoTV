import { Component, input, model, output } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Hsla } from 'app/models/Hsla';
import { DayTime, ColorService } from 'app/services/color.service';

@Component({
  selector: 'hsl-slider',
  imports: [FormsModule],
  templateUrl: './hsl-slider.component.html',
  styleUrl: './hsl-slider.component.scss',
})
export class HslSliderComponent {
  dayTime = input.required<DayTime>();

  hue_value = model.required<number>();
  sat_value = model.required<number>();
  light_value = model.required<number>();
  trans_value = model.required<number>();
  // hue_value = model<number>(0);
  // sat_value = model<number>(0);
  // light_value = model<number>(0);
  // trans_value = model<number>(0.2);

  // hue = output<number>();
  // saturation = output<string>();
  // lightness = output<string>();
  // transparency = output<number>();

  // hueObservable = outputToObservable(this.hue);
  // saturationObservable = outputToObservable(this.saturation);
  // lightnessObservable = outputToObservable(this.lightness);
  // transparencyObservable = outputToObservable(this.transparency);

  constructor(private colorService: ColorService) {}

  onHueChange() {
    console.log('hue changed', this.hue_value());
    this.colorService.updateColorComponent(
      this.dayTime(),
      'hue',
      this.hue_value(),
    );
  }
  onSaturationChange() {
    console.log('saturation changed', this.sat_value());
    this.colorService.updateColorComponent(
      this.dayTime(),
      'saturation',
      this.sat_value(),
    );
  }
  onLightnessChange() {
    console.log('lightness changed', this.light_value());
    this.colorService.updateColorComponent(
      this.dayTime(),
      'lightness',
      this.light_value(),
    );
  }

  onTransparencyChange() {
    console.log('transparency changed', this.trans_value());
    this.colorService.updateColorComponent(
      this.dayTime(),
      'transparency',
      this.trans_value(),
    );
  }
}
