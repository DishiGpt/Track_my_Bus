
export interface BusRoute {
  _id?: string;
  routeNumber: string;
  origin: string;
  destination: string;
  color: string;
  stops: string[];
}

export interface BusLocation {
  routeNumber: string;
  lat: number;
  lng: number;
  timestamp: number;
  heading?: number;
  isFull: boolean;
}

export interface SearchResult {
  route: BusRoute;
  matchingStop: string;
}
