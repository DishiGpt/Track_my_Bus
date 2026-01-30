
import { BusRoute } from './types';

export const UDAIPUR_ROUTES: BusRoute[] = [
  {
    routeNumber: "1",
    origin: "Rampura Circle",
    destination: "Dabok",
    color: "#22c55e", // Green
    stops: ["Rampura Circle", "Malla Talai", "Fatehsagar", "Chetak Circle", "Delhi Gate", "Surajpole", "City Station", "Dabok"]
  },
  {
    routeNumber: "2",
    origin: "Badgaon",
    destination: "Titardi",
    color: "#3b82f6", // Blue
    stops: ["Badgaon", "Syphon", "Fatehpura", "Sukhadia Circle", "Chetak Circle", "Delhi Gate", "Titardi"]
  },
  {
    routeNumber: "7",
    origin: "City Station",
    destination: "Amberi",
    color: "#f97316", // Orange
    stops: ["City Station", "Surajpole", "Delhi Gate", "Chetak Circle", "Sukhadia Circle", "Celebration Mall", "Amberi"]
  },
  {
    routeNumber: "9",
    origin: "Chetak Circle",
    destination: "Savina",
    color: "#a855f7", // Purple
    stops: ["Chetak Circle", "Court Chouraha", "Udiapole", "Savina"]
  }
];

export const MAP_CENTER = { lat: 24.5854, lng: 73.7125 };
export const MAP_ZOOM = 14;
