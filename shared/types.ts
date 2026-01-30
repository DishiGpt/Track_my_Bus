
export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusRoute {
  _id?: string;
  routeNumber: string;
  origin: string;
  destination: string;
  color: string;
  stops: string[];
  path: LatLng[]; // Geo-coordinates for drawing the polyline
}

export interface BusLocation {
  routeNumber: string;
  lat: number;
  lng: number;
  timestamp: number;
  heading?: number;
  isFull: boolean;
}
