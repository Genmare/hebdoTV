import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CanalPlusServiceService } from 'app/services/canal-plus-service.service';
import { LocalService } from 'app/services/local.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  channels = [
    { channelNum: '532', name: 'CINE+ FESTIVAL' },
    { channelNum: '531', name: 'CINE+ CLASSIC' },
  ];
  option!: string;

  constructor(
    private canalPlusService: CanalPlusServiceService,
    private router: Router,
    private localService: LocalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
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

    if (this.canalPlusService.token) {
      this.canalPlusService.makeChannelList()?.subscribe((channels) => {
        this.channels = channels;
        console.log('this.option:', this.option);
        const channel = this.route.snapshot.queryParams['channel'];
        console.log('header, route.snapshot:', this.route.snapshot);
        console.log('header, route.snapshot, channel:', channel);

        if (channel) this.option = channel;
        else this.option = this.channels[0].channelNum;

        const channelNum = this.localService.getData('currentChannel');

        if (channelNum) this.option = channelNum;

        this.canalPlusService.setChannel(this.option);
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
}
