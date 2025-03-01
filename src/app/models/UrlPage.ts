export interface UrlPage {
  currentPage: CurrentPage;
  meta: Meta;
  tracking: Tracking;
  detail?: Detail;
  perso: Perso[];
  episodes?: Episodes;
  parentShow: ParentShow;
}

export interface CurrentPage {
  displayTemplate: string;
  displayName: string;
  path: string;
}

export interface Meta {
  title: string;
  description: string;
}

export interface Tracking {
  dataLayer: DataLayer;
}

export interface DataLayer {
  page_level_1: string;
  page_level_2: string;
  page_level_3: string;
  page_level_4: string;
  page_name: string;
  page_title: string;
  page_display_title: string;
  user_profile: string;
  channel: string;
  content_id: string;
  content_in_offer: string;
  genre: string;
  subgenre: string;
  channel_name: string;
  content_title: string;
  content_protection: string;
}

export interface Detail {
  informations: Informations;
  selectedEpisode: SelectedEpisode;
}

export interface Informations {
  type: string;
  contentID: string;
  idRevision: string;
  title: string;
  URLImage: string;
  URLLogoChannel: string;
  altLogoChannel: string;
  duration?: number;
  summary: string;
  isTVoD: boolean;
  editorialTitle: string;
  sharingURL: string;
  URLVitrine: string;
  closedCaptioning: boolean;
  consumptionPlatform: string;
  displayPersoButtons: boolean;
  parentalRatings: ParentalRating[];
  trailer: boolean;
  reviews: Review[];
  audioLanguage: string;
  subtitle: string;
  noPub: boolean;
  personnalities: Personnality[];
  recommendationTags: RecommendationTag[];
  productionYear: string;
  contentAvailability: ContentAvailability;
}

export interface Personnality {
  prefix: string;
  personnalitiesList: PersonnalitiesList[];
}

export interface PersonnalitiesList {
  title: string;
  onClick: OnClick;
}

export interface OnClick {
  displayName: string;
  displayTemplate: string;
  URLPage: string;
  path: string;
  parameters: Parameter[];
}

export interface Parameter {
  in: string;
  id: string;
  enum: string[];
}

export interface Review {
  name: string;
  displayRating: boolean;
  stars: Stars;
  review?: string;
}

export interface Stars {
  type: string;
  value: number;
}

export interface RecommendationTag {
  label: string;
  onClick: OnClick2;
}

export interface OnClick2 {
  displayTemplate: string;
  displayName: string;
  URLPage: string;
  path: string;
}

export interface ParentalRating {
  value: string;
  authority: string;
}

export interface SelectedEpisode {
  seasonID: string;
  episodeID: string;
  showID: string;
}

export interface Perso {
  platform: string;
}

export interface Episodes {
  label: string;
  paging: Paging;
  contents: Content[];
}

export interface Paging {
  iterationType: string;
  nbContents: number;
  URLPage: string;
}

export interface Content {
  URLLogoChannel: string;
  contentID: string;
  idRevision: string;
  title: string;
  URLImage: string;
  summary: string;
  subtitle: string;
  sharingURL: string;
  path: string;
  URLPage: string;
  consumptionPlatform: string;
  editorialTitle: string;
  noPub: boolean;
  isTVoD: boolean;
  contentAvailability: ContentAvailability;
  parentalRatings: ParentalRating2[];
}

export interface ContentAvailability {
  isInCatalog: boolean;
  isInOffer: boolean;
  availabilities: Availabilities;
}

export interface Availabilities {
  download: Download;
  stream: Stream;
  live: Live;
}

export interface Download {
  consumptionPlatform: string;
  isAvailable: boolean;
  isInOffer: boolean;
  URLMedias: string;
}

export interface Stream {
  consumptionPlatform: string;
  isAvailable: boolean;
  isInOffer: boolean;
  URLMedias: string;
}

export interface Live {
  isInOffer: boolean;
  isAvailable: boolean;
  availableStartUpModes: string[];
  broadcasts: Broadcast[];
}

export interface Broadcast {
  channelName: string;
  channelId: number;
  broadcastId: string;
  startTime: number;
  endTime: number;
  startOverEndTime: number;
  default: boolean;
}

export interface ParentalRating2 {
  value: string;
  authority: string;
}

export interface ParentShow {
  informations: Informations2;
}

export interface Informations2 {
  contentID: string;
  title: string;
  URLPage: string;
  path: string;
}
