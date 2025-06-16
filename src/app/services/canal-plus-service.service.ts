import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Day } from 'app/models/Day';
import { BroadcastChannel } from 'app/models/BroadcastChannel';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  Subscriber,
  switchMap,
} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalService } from './local.service';
import { TimeSlice } from 'app/models/TimeSlice';

@Injectable({
  providedIn: 'root',
})
export class CanalPlusServiceService {
  readonly tokenKey = 'hebdo_token';

  private currentChannelSubject!: BehaviorSubject<string>;
  public currentChannelObservable!: Observable<string>;

  token!: string | undefined;
  public tokenObservable!: Observable<string>;
  timeSclices!: TimeSlice[][];

  private daysSubject = new BehaviorSubject<TimeSlice[][]>([]);
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
          this.timeSclices = values;
          console.log(
            'getWeekDataOfChannel',
            'this.timeSclices',
            this.timeSclices,
          );
          this.daysSubject.next(this.timeSclices);
        });
      }
    });

    this.tokenObservable = new Observable<string>((observer) => {
      this.getDataFromCanalPlus().subscribe((response) => {
        if (!this.token) {
          console.log('tokenObservable, getDataFromCanalPlus');
          const token = this.fetchToken(response, observer);
          if (token) observer.next(token);
        }
      });
    });
  }

  private fetchToken(
    response: string,
    observer: Subscriber<string>,
  ): string | undefined {
    const displayHTML = this.sanitizer.sanitize(0, response);

    const foundToken = (displayHTML as string).match(/"token":"([^"]+)/)![1];
    if (foundToken) {
      this.setToken(foundToken);
      return foundToken;
    }
    return undefined;
  }

  setToken(token: string) {
    this.token = token;
    this.localService.saveData(this.tokenKey, token);
  }

  public getNumDay(): number | undefined {
    return this.timeSclices[0].length;
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

  getOldToken(): string {
    return this.token ?? '';
  }

  refreshToken(): Observable<string> {
    return this.getDataFromCanalPlus().pipe(
      map((response) => {
        const displayHTML = this.sanitizer.sanitize(0, response);

        const foundToken = (displayHTML as string).match(
          /"token":"([^"]+)/,
        )![1];
        this.localService.saveData(this.tokenKey, foundToken);
        return foundToken;
      }),
      switchMap((newToken) => {
        return new Observable<string>((observer) => {
          // observer.next(response.token);
          observer.next(newToken);
          observer.complete();
        });
      }),
    );
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
                channels: {
                  name: string;
                  channelNum: string;
                  logoPath: {
                    URLLogoChannel: string;
                    URLLogoChannelForDarkMode: string;
                    URLLogoChannelForLightMode: string;
                  };
                }[],
                currentChannel,
              ) => {
                // console.log('currentChannel', currentChannel);

                const found = regex.exec(currentChannel.URLChannelSchedule);
                if (found)
                  channels.push({
                    name: currentChannel.name,
                    channelNum: found[1],
                    logoPath: {
                      URLLogoChannel: currentChannel.URLLogoChannel,
                      URLLogoChannelForDarkMode:
                        currentChannel.URLLogoChannelForDarkMode,
                      URLLogoChannelForLightMode:
                        currentChannel.URLLogoChannelForLightMode,
                    },
                  });
                return channels;
              },
              [],
            );
          }),
        );
    return undefined;
  }

  // getWeekDataOfChannel(channel: string): Observable<Day[]> {
  getWeekDataOfChannel(channel: string): Observable<TimeSlice[][]> {
    // const channel = 531;
    // const day = 0;
    // return this.http.get<Object>(`https://hodor.canalplus.pro/api/v2/mycanal/channels/${token}/${channel}/broadcasts/day/${day}`)

    // https://hodor.canalplus.pro/api/v2/mycanal/epgGrid/${token}/day/0?discoverMode=true
    console.log('getWeekDataOfChannel, channel:', channel);
    console.log('getWeekDataOfChannel, token:', this.token);

    return forkJoin(
      // [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((day) =>
      // [-1, 0, 1, 2, 3, 4, 5, 6, 7].map((day) =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((day) =>
        // [-1, 0, 1].map((day) =>
        // [0].map((day) =>
        // [1].map((day) =>
        this.http.get<Day>(
          `https://hodor.canalplus.pro/api/v2/mycanal/channels/${this.token}/${channel}/broadcasts/day/${day}`,
        ),
      ),
    ).pipe(
      map((days: Day[]) => {
        // Initialisation du tableau de taille 5 avec des sous-tableaux vides
        const accumulatedTimeSlices: TimeSlice[][] = Array.from(
          { length: 5 },
          () => [],
        );

        // pour savoir si le programme suivant est le même que le programme actuel (épisode suivant)
        let name: string;
        // Remplissage du tableau
        days.forEach((day) => {
          day.timeSlices.forEach((timeSlice, index) => {
            timeSlice.contents.forEach((content, content_index) => {
              if (content_index == 0) name = content.title;
              else if (name === content.title) content.next_episode = true;
              name = content.title;
            });

            accumulatedTimeSlices[index].push(timeSlice);
          });
        });

        console.log(
          'service accumulatedTimeSlices pipe',
          accumulatedTimeSlices,
        );

        return accumulatedTimeSlices; // Renvoie TimeSlice[][]
      }),
    );
  }
}
