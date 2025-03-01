export interface BroadcastChannel {
  currentPage: CurrentPage;
  tracking: Tracking;
  channels: Channel[];
}

export interface CurrentPage {
  displayTemplate: string;
}

export interface Tracking {
  dataLayer: DataLayer;
}

export interface DataLayer {
  page_level_1: string;
  page_level_2: string;
  page_name: string;
  page_title: string;
  page_display_title: string;
  bo_layout: string;
  user_profile: string;
  channel: string;
  content_protection: string;
}

export interface Channel {
  name: string;
  URLLogoChannel: string;
  URLLogoChannelForDarkMode: string;
  URLLogoChannelForLightMode: string;
  URLChannelSchedule: string;
  zapNumber: number;
  onClick?: OnClick;
}

export interface OnClick {
  displayTemplate: string;
  displayName?: string;
  URLPage: string;
  path: string;
  parameters: Parameter[];
}

export interface Parameter {
  in: string;
  id: string;
  enum?: string[];
}
