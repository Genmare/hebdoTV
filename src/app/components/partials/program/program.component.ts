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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { setUrlImage } from 'app/components/tools/imageTools';

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

  picture_visible = input<boolean>(true);

  content!: UrlPage;

  picture!: string;

  duration!: number;

  private loading = true;

  static counter = 0;

  // formatTitle!: SafeHtml | undefined;

  constructor(
    private progContentService: ProgContentService,
    private satinizer: DomSanitizer,
  ) {
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
            this.picture = setUrlImage(
              this.content.detail.informations.URLImage,
              254,
              143,
              80,
            );
          }
          // this.formatTitle = this.setFormatTitle();
          this.loading = false;
        });
    }
  }

  // setUrlImage(urlImage: string, x: number, y: number, quality: number) {
  //   return urlImage
  //     .replace('{resolutionXY}', x.toString() + 'x' + y.toString())
  //     .replace('{imageQualityPercentage}', quality.toString());
  // }

  protected get loaded() {
    return this.content && !this.loading;
  }

  getHeight(): string {
    const duration = this.getDuration();
    let height = 0;
    height = this.getReviewNumber() * 16;
    if (duration <= 30) height += 278;
    else height += 250 + duration;
    if (!this.picture_visible()) {
      height = 130;
      if (this.content && this.content.detail?.informations.reviews) {
        height += this.content.detail.informations.reviews.length * 16;
      }
    }
    if (this.content && this.content.detail?.informations.personnalities)
      height += 15;
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

  // setFormatTitle(): SafeHtml | undefined {
  //   let de = 'de ';
  //   if (this.content && this.content.detail?.informations.personnalities) {
  //     const title =
  //       this.content.detail.informations.personnalities[0].personnalitiesList[0]
  //         .title;
  //     const firstLetter = title[0].toLowerCase();
  //     if (this.vowelTest(firstLetter)) de = "d'";
  //     return this.satinizer.bypassSecurityTrustHtml(
  //       `${de}<span class="name">${title}</span>`,
  //     );
  //   }
  //   return undefined;
  // }

  // private vowelTest(s: string) {
  //   return /^[aAeéèEiIoOuU]$/i.test(s);
  // }
}
