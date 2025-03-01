import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input } from '@angular/core';

@Component({
  selector: 'program-picture',
  imports: [],
  templateUrl: './program-picture.component.html',
  styleUrl: './program-picture.component.scss',
  animations: [
    trigger('animation', [
      transition(':enter', [
        style([
          {
            opacity: 0,
            scale: 0.8,
          },
        ]),
        animate(
          // '0.15s ease-in-out',
          '1s ease-in-out',
          style({
            opacity: 1,
            scale: 4,
          }),
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          scale: 1,
        }),
        animate(
          // '0.15s ease-in-out',
          '1s ease-in-out',
          style({
            opacity: 0,
            scale: 0.8,
          }),
        ),
      ]),
    ]),
  ],
})
export class ProgramPictureComponent {
  loaded = input(true);

  href = input('');

  src = input('');
}
