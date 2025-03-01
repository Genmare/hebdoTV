import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  effect,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { Program } from 'app/models/program';
import { UrlPage } from 'app/models/UrlPage';
import { ProgContentService } from 'app/services/prog-content.service';
import { count, Observable } from 'rxjs';
import { ProgramPictureComponent } from '../program-picture/program-picture.component';
import { StarContentComponent } from '../stars/star-content/star-content.component';

@Component({
  selector: 'program',
  imports: [
    CommonModule,
    DatePipe,
    ProgramPictureComponent,
    StarContentComponent,
  ],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
})
export class ProgramComponent implements OnInit {
  program = input<Program>();

  content!: UrlPage;

  picture!: string;

  duration!: number;

  private loading = true;

  static counter = 0;

  constructor(private progContentService: ProgContentService) {
    effect(() => this.getContent());
  }

  ngOnInit(): void {
    // this.getContent();
    // console.log('ngOnInit, program:', this.program);
    this.getEditorialTitleDate('');

    ProgramComponent.counter++;
  }

  private convert(t: number) {
    const dt = new Date(t);
    const hr = dt.getUTCHours();
    const m = '0' + dt.getUTCMinutes();

    return hr + ':' + m.substr(-2);
  }

  getDuration(): number {
    // console.log(this.program.title, 'this.content', this.content);

    if (this.duration) return this.duration;

    let actual_duration = 0;

    if (this.content) {
      if (this.content.episodes) {
        if (
          this.content.episodes.contents[0].contentAvailability.availabilities
            .live.broadcasts
        ) {
          const start = new Date(
            this.content.episodes.contents[0].contentAvailability.availabilities.live.broadcasts[0].startTime,
          ).getTime();
          const end = new Date(
            this.content.episodes.contents[0].contentAvailability.availabilities.live.broadcasts[0].endTime,
          ).getTime();
          actual_duration = (end - start) / 60;
        }

        if (this.content?.episodes?.contents[0].editorialTitle) {
          // console.log(
          //   'editorialTitle',
          //   this.content.episodes.contents[0].editorialTitle,
          // );
          const editMin = this.getEditorialTitleDate(
            this.content.episodes.contents[0].editorialTitle,
          );
          if (editMin) actual_duration = parseInt(editMin);
        }
      }
      const movie_duration = this.content.detail?.informations?.duration;
      if (movie_duration) {
        console.log(
          ProgramComponent.counter,
          this.content.detail?.informations.title,
          'program, content:',
          this.content,
        );
        // if ('duration' in this.content.detail.informations) {
        actual_duration = movie_duration ?? 0;
        // duration = duration / 1000;
        actual_duration = actual_duration / 60000;
      }
    }
    // duration /= 60;
    // console.log(this.program.title, 'duration:', duration);

    this.duration = actual_duration;
    return actual_duration;
  }

  private getContent() {
    // this.picture = imagePlaceholder;
    this.loading = true;
    // this.picture = 'images/dummy_254x143_ffffff_222299_chargement.jpg';
    if (this.program() && this.program() !== undefined) {
      this.progContentService
        .getContent(this.program()!.onClick.URLPage)
        .subscribe((prog) => {
          this.content = prog;
          console.log('program, content:', this.content);
          // console.log('duration:', this.getDuration());

          // this.picture = content.detail.informations.URLImage
          if (this.content?.detail) {
            this.picture = this.setUrlImage(
              this.content.detail.informations.URLImage,
              254,
              143,
              80,
            );
          }
          this.loading = false;
        });
    }
  }

  setUrlImage(urlImage: string, x: number, y: number, quality: number) {
    return urlImage
      .replace('{resolutionXY}', x.toString() + 'x' + y.toString())
      .replace('{imageQualityPercentage}', quality.toString());
  }

  protected get loaded() {
    return this.content && !this.loading;
  }

  getHeight(): string {
    const duration = this.getDuration();
    let height = 0;
    height = this.getReviewNumber() * 16;
    if (duration <= 30) height += 258;
    else height += 250 + duration;
    return height + 'px';
  }

  private getEditorialTitleDate(editorialTitle: string): string | undefined {
    // David Lynch, étrange et familier, France, 2024, 24 min
    editorialTitle = 'David Lynch, étrange et familier, France, 2024, 24 min';
    const regex = /\s(\d+)\smin$/;
    const result = editorialTitle.match(regex);
    // console.log('getEditorialTitleDate, result:', result);
    return result ? result[1] : undefined;
  }

  private getReviewNumber(): number {
    let review_num = 0;
    if (this.content && this.content.detail?.informations.reviews)
      review_num = this.content.detail?.informations.reviews.length;
    return review_num;
  }
}
