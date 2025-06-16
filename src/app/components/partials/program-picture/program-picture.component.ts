import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, input, signal } from '@angular/core';

const duration_enter = 1000; // 0.15s
const duration_leave = 500; // 0.15s
const delay = duration_leave;
// const delay = 3000;

const leave_settings = [
  style({
    opacity: 1,
    tranform: 'scale(1)',
  }),
  animate(
    `${duration_leave}ms ease-in-out`,
    style({
      opacity: 0,
      tranform: 'scale(0.8)',
    }),
  ),
];

const enter_settings = [
  style({
    opacity: 0,
    tranform: 'scale(0.8)',
  }),
  animate(
    `${duration_enter}ms ${delay}ms ease-in-out`,
    style({
      opacity: 1,
      tranform: 'scale(4)',
    }),
  ),
];

@Component({
  selector: 'program-picture',
  imports: [],
  templateUrl: './program-picture.component.html',
  styleUrl: './program-picture.component.scss',
  // animations: [
  //   trigger('animation', [
  //     // transition(':enter', enter_settings),
  //     transition(':leave', leave_settings),
  //   ]),
  // ],
})
export class ProgramPictureComponent {
  loaded = input(true);

  href = input('');

  src = input('');

  alt = input('');

  animate = signal<boolean>(false);

  showImg = signal<boolean>(true);

  constructor() {
    effect(() => {
      const _ = this.src();

      // this.animate.set(false);
      requestAnimationFrame(() => {
        console.log(
          'ProgramPictureComponent: src changed, triggering animation',
        );

        // this.animate.set(true);
        // setTimeout(() => {
        //   this.animate.set(true);
        // }, duration_enter + delay);

        this.showImg.set(false);
        setTimeout(() => this.showImg.set(true));
      });
    });
  }
}
