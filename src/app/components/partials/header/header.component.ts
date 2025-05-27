import { ViewportRuler } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanalPlusServiceService } from 'app/services/canal-plus-service.service';
import { LocalService } from 'app/services/local.service';
import { SettingsComponent } from '../settings/settings.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { setUrlImage } from 'app/components/tools/imageTools';
import { ImgSelectComponent } from 'app/components/tools/img-select/img-select.component';
import { DayTimeService } from 'app/services/day-time.service';

type Channel = {
  channelNum: string;
  name: string;
  logoPath: {
    URLLogoChannel: string;
    URLLogoChannelForDarkMode: string;
    URLLogoChannelForLightMode: string;
  };
};

const hidden = { transform: 'translateX(120%)', opacity: 0 };
const visible = { transform: 'translateX(0)', opacity: 1 };
const timing = '0.5s ease-in';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    ImgSelectComponent,
    NgSelectModule,
    RouterLink,
    SettingsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [style(hidden), animate(timing, style(visible))]),
      transition(':leave', [style(visible), animate(timing, style(hidden))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  // channels = [
  //   { channelNum: '532', name: 'CINE+ FESTIVAL' },
  //   { channelNum: '531', name: 'CINE+ CLASSIC' },
  // ];
  channels: Channel[] = [];
  selectedChannel = 'toto';

  option!: string;
  dayNumbers!: number[];
  bSelectSize = false;
  bSettings = false;

  private dayTimeAnchorRefs = viewChildren('anchorRef', {
    read: ElementRef<HTMLAnchorElement>,
  });

  constructor(
    private canalPlusService: CanalPlusServiceService,
    private router: Router,
    private localService: LocalService,
    private route: ActivatedRoute,
    private viewportRuler: ViewportRuler,
    private dayTimeService: DayTimeService,
    private ngZone: NgZone,
  ) {
    this.viewportRuler
      .change(300)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.ngZone.run(() => {
          // console.log(
          //   'ViewportRuler, change',
          //   this.viewportRuler.getViewportSize(),
          // );
          if (this.viewportRuler.getViewportSize().width <= 1210)
            this.bSelectSize = true;
          else this.bSelectSize = false;
        });
      });

    this.dayTimeService.getCurrentSection().subscribe((section) => {
      let anchorElementRef = null;
      const sectionIdName = section.concat('_id');
      for (const anchorRef of this.dayTimeAnchorRefs()) {
        anchorElementRef = (anchorRef as ElementRef<HTMLAnchorElement>)
          .nativeElement;
        if (anchorElementRef.id === sectionIdName) {
          anchorElementRef.classList.add('active');
          continue;
        }
        anchorElementRef.classList.remove('active');
      }
    });
  }

  ngOnInit(): void {
    // console.log('route.snapshot', this.route.snapshot);
    this.route.queryParams.subscribe((params) => {
      console.log('params:', params);
      this.option = params['channel'];
      this.canalPlusService.setChannel(this.option);
    });

    this.canalPlusService.tokenObservable.subscribe(() => {
      this.canalPlusService.makeChannelList()?.subscribe((channels) => {
        this.channels = channels;
        this.canalPlusService.setChannel(channels[0].channelNum);
      });
    });

    const width = 20;
    const height = 20;
    const quality = 40;
    if (this.canalPlusService.token) {
      this.canalPlusService.makeChannelList()?.subscribe((channels) => {
        this.channels = channels.map((channel) => {
          const logoPath = channel.logoPath;
          logoPath.URLLogoChannel = setUrlImage(
            logoPath.URLLogoChannel,
            width,
            height,
            quality,
          );
          logoPath.URLLogoChannelForDarkMode = setUrlImage(
            logoPath.URLLogoChannelForDarkMode,
            width,
            height,
            quality,
          );
          logoPath.URLLogoChannelForLightMode = setUrlImage(
            logoPath.URLLogoChannelForLightMode,
            width,
            height,
            quality,
          );
          return {
            ...channel,
            logoPath: logoPath,
          };
        });
        this.selectedChannel = this.channels[0].name;
        console.log('this.option:', this.option);
        const channel = this.route.snapshot.queryParams['channel'];
        console.log('header, route.snapshot:', this.route.snapshot);
        console.log('header, route.snapshot, channel:', channel);

        if (channel) this.option = channel;
        else this.option = this.channels[0].channelNum;

        const channelNum = this.localService.getData('currentChannel');

        if (channelNum) this.option = channelNum;

        this.canalPlusService.setChannel(this.option);

        console.log('dayNumbers');

        const num = this.canalPlusService.getNumDay();
        console.log('dayNumbers, num =', num);

        if (num)
          this.dayNumbers = Array.from(
            { length: num },
            (element, index) => index,
          );
      });
    }
  }

  onSelected(value: string) {
    console.log('selected: ', value);
    this.canalPlusService.setChannel(value);
    this.localService.saveData('currentChannel', value);
    this.router.navigate(['/home'], {
      queryParams: { channel: value },
    });
  }

  onSelected2(chan: Channel) {
    console.log('selected: ', chan);
    this.canalPlusService.setChannel(chan.channelNum);
    this.localService.saveData('currentChannel', chan.channelNum);
    this.router.navigate(['/home'], {
      queryParams: { channel: chan.channelNum },
    });
  }

  getDay(index: number): Date {
    const currentDay = new Date();

    currentDay.setDate(currentDay.getDate() + index);
    console.log('getDay, dayNumbers, index :', index, 'currentDay', currentDay);

    return currentDay;
  }

  toggleSettings() {
    this.bSettings = !this.bSettings;
  }
}
