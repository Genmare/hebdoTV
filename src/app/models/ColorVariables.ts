import { DayTime } from 'app/services/color.service';

export type ColorVariables = {
  [K in keyof typeof DayTime]?: {
    hue: number;
    saturation: number;
    lightness: number;
    transparency: number;
  };
};
