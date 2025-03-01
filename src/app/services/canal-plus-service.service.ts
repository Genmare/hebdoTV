import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Day } from 'app/models/Day';
import { BroadcastChannel } from 'app/models/BroadcastChannel';
import { BehaviorSubject, forkJoin, map, Observable, reduce } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LocalService } from './local.service';
import { ActivatedRoute } from '@angular/router';
import { TimeSlice } from 'app/models/TimeSlice';

@Injectable({
  providedIn: 'root',
})
export class CanalPlusServiceService {
  readonly tokenKey = 'hebdo_token';

  // private currentChannelSubject = new BehaviorSubject<string>('0');
  // public currentChannelObservable = this.currentChannelSubject.asObservable();
  private currentChannelSubject!: BehaviorSubject<string>;
  public currentChannelObservable!: Observable<string>;

  token!: string | undefined;
  // public tokenObservable = new Observable<string>(token);
  public tokenObservable!: Observable<string>;
  days!: Day[];
  // days!: TimeSlice[][];

  private daysSubject = new BehaviorSubject<Day[]>([]);
  // private daysSubject = new BehaviorSubject<TimeSlice[][]>([]);
  public daysObservable = this.daysSubject.asObservable();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private localService: LocalService,
  ) {
    // check if we already have a local token
    this.token = localService.getData(this.tokenKey) ?? undefined;
    console.log('\nconstructor - token:', this.token);

    const channelNum = localService.getData('currentChannel') ?? '0';

    this.currentChannelSubject = new BehaviorSubject<string>(channelNum);
    this.currentChannelObservable = this.currentChannelSubject.asObservable();

    this.currentChannel = channelNum;
    console.log('this.currentChannel:', this.currentChannel);

    this.currentChannelSubject.subscribe((num) => {
      console.log('currentChannelSubject.subscribe', 'token:', this.token);

      if (this.token && this.currentChannel) {
        console.log('if (this.token)');
        console.log('\tthis.currentChannel', this.currentChannel);

        this.getWeekDataOfChannel(this.currentChannel).subscribe((values) => {
          this.days = values;
          console.log('getWeekDataOfChannel', 'this.days', this.days);
          this.daysSubject.next(this.days);
        });
      }
    });

    this.tokenObservable = new Observable<string>((observer) => {
      this.getDataFromCanalPlus().subscribe((response) => {
        if (!this.token) {
          console.log('tokenObservable, getDataFromCanalPlus');
          const displayHTML = this.sanitizer.sanitize(0, response);

          const foundToken = (displayHTML as string).match(
            /"token":"([^"]+)/,
          )![1];
          if (foundToken) {
            this.setToken(foundToken);
            observer.next(this.token);
          }
        }
      });
    });
  }

  setToken(token: string) {
    this.token = token;
    this.localService.saveData(this.tokenKey, token);
  }

  public get currentChannel(): string {
    return this.currentChannelSubject.value;
  }

  public set currentChannel(channelNum: string) {
    this.currentChannelSubject.next(channelNum);
  }

  setChannel(num: string) {
    console.log('setChannel, num:', num);

    this.currentChannelSubject.next(num);
  }

  private getDataFromCanalPlus() {
    // return this.http.get<object>('https://www.canalplus.com/programme-tv/',optionRequete)
    return this.http.get('/programme-tv', { responseType: 'text' });
  }

  getToken(): string | undefined {
    this.getDataFromCanalPlus().subscribe((response) => {
      const displayHTML = this.sanitizer.sanitize(0, response);

      const foundToken = (displayHTML as string).match(/"token":"([^"]+)/)![1];
      return foundToken;
    });
    return undefined;
  }

  // makeChannelList(token: string) {
  makeChannelList() {
    const regex = /\/(\d+)\/broadcasts/;
    console.log('makeChannelList');

    // if (token)
    if (this.token)
      return this.http
        .get<BroadcastChannel>(
          `https://hodor.canalplus.pro/api/v2/mycanal/epgGrid/${this.token}/day/0?discoverMode=true`,
        )
        .pipe(
          map((bChannel) => {
            return bChannel.channels.reduce(
              (
                channels: { name: string; channelNum: string }[],
                currentChannel,
              ) => {
                const found = regex.exec(currentChannel.URLChannelSchedule);
                if (found)
                  channels.push({
                    name: currentChannel.name,
                    channelNum: found[1],
                  });
                return channels;
              },
              [],
            );
          }),
        );
    return undefined;
  }

  getWeekDataOfChannel(channel: string): Observable<Day[]> {
    // getWeekDataOfChannel(channel: string): Observable<TimeSlice[][]> {

    // const channel = 531;
    // const day = 0;
    // return this.http.get<Object>(`https://hodor.canalplus.pro/api/v2/mycanal/channels/${token}/${channel}/broadcasts/day/${day}`)

    // https://hodor.canalplus.pro/api/v2/mycanal/epgGrid/${token}/day/0?discoverMode=true
    console.log('getWeekDataOfChannel, channel:', channel);
    console.log('getWeekDataOfChannel, token:', this.token);

    return forkJoin(
      // [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((day) =>
      // [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((day) =>
      [-1, 0, 1].map((day) =>
        // [-1].map((day) =>
        // this.http.get<Day>(
        //   `https://hodor.canalplus.pro/api/v2/mycanal/channels/${this.token}/${channel}/broadcasts/day/${day}`,
        // ),
        this.http.get<Day>(
          `https://hodor.canalplus.pro/api/v2/mycanal/channels/${this.token}/${channel}/broadcasts/day/${day}`,
        ),
      ),
    );
    // .pipe(
    //   map((days: Day[]) => {
    //     // Initialisation du tableau de taille 5 avec des sous-tableaux vides
    //     const accumulatedTimeSlices: TimeSlice[][] = Array.from(
    //       { length: 5 },
    //       () => [],
    //     );

    //     // Remplissage du tableau
    //     days.forEach((day) => {
    //       day.timeSlices.forEach((timeSlice, index) => {
    //         accumulatedTimeSlices[index].push(timeSlice);
    //       });
    //     });

    //     return accumulatedTimeSlices; // Renvoie TimeSlice[][]
    //   }),
    // );
  }
}

// return forkJoin(
//   // [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((day) =>
//   // [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((day) =>
//   [-1, 0, 1].map((day) =>
//     // [-1].map((day) =>
//     // this.http.get<Day>(
//     //   `https://hodor.canalplus.pro/api/v2/mycanal/channels/${this.token}/${channel}/broadcasts/day/${day}`,
//     // ),
//     this.http.get<Day>(
//       `https://hodor.canalplus.pro/api/v2/mycanal/channels/${this.token}/${channel}/broadcasts/day/${day}`,
//     ),
//   ),
