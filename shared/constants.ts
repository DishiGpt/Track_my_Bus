
import { BusRoute } from './types';

export const UDAIPUR_ROUTES: BusRoute[] = [
  {
    routeNumber: "1",
    origin: "Badgaon",
    destination: "Titardi",
    color: "#22c55e",
    stops: ["Badgaon", "Syphon", "Fatehpura", "Chetak Circle", "Delhi Gate", "Surajpole", "Sector 4", "Sector 6", "Titardi"],
    path: []
  },
  {
    routeNumber: "2",
    origin: "Rampura Circle",
    destination: "Dabok Airport",
    color: "#3b82f6",
    stops: ["Rampura Circle", "Malla Talai", "Radaji Circle", "Chetak Circle", "Delhi Gate", "Surajpole", "Thokar Chouraha", "Debari", "Dabok Airport"],
    path: []
  },
  {
    routeNumber: "3",
    origin: "City Railway Station",
    destination: "Amberi",
    color: "#f97316",
    stops: ["City Railway Station", "Udaipole", "Surajpole", "Delhi Gate", "Chetak Circle", "Sukhadia Circle", "Celebration Mall", "Bhuwana", "Amberi"],
    path: []
  },
  {
    routeNumber: "4",
    origin: "Balicha",
    destination: "Bedla",
    color: "#ef4444",
    stops: ["Balicha", "Goverdhan Vilas", "Paras Circle", "Udaipole", "Delhi Gate", "Chetak Circle", "Panchwati", "Bedla"],
    path: []
  },
  {
    routeNumber: "5",
    origin: "Savina Krishi Mandi",
    destination: "Fatehsagar",
    color: "#a855f7",
    stops: ["Savina Krishi Mandi", "Sector 9", "Hiran Magri", "Sevashram", "Surajpole", "Delhi Gate", "Chetak Circle", "Mohta Park", "Fatehsagar"],
    path: []
  },
  {
    routeNumber: "6",
    origin: "Titardi",
    destination: "Chetak Circle",
    color: "#ec4899",
    stops: ["Titardi", "Sector 3", "Sevashram", "Bansal Cinema", "Delhi Gate", "Chetak Circle"],
    path: []
  },
  {
    routeNumber: "7",
    origin: "Bhuwana",
    destination: "Jagdish Temple",
    color: "#eab308",
    stops: ["Bhuwana", "Celebration Mall", "Sukhadia Circle", "Hathipole", "Delhi Gate", "City Palace", "Jagdish Temple"],
    path: []
  },
  {
    routeNumber: "8",
    origin: "Miraj Mall",
    destination: "Pratap Nagar",
    color: "#14b8a6",
    stops: ["Miraj Mall", "Sukhadia Circle", "Chetak Circle", "Delhi Gate", "Surajpole", "Ayad Puliya", "Pratap Nagar"],
    path: []
  },
  {
    routeNumber: "9",
    origin: "Reti Stand",
    destination: "Shilpgram",
    color: "#6366f1",
    stops: ["Reti Stand", "Paras Circle", "Udaipole", "Delhi Gate", "Chetak Circle", "Malla Talai", "Shilpgram"],
    path: []
  },
  {
    routeNumber: "10",
    origin: "Sector 3",
    destination: "Sector 3 (Loop)",
    color: "#84cc16",
    stops: ["Sector 3", "Sector 4", "Sector 5", "Sector 6", "Satellite Hospital", "Sevashram", "Sector 3"],
    path: []
  }
];

export const MAP_CENTER = { lat: 24.5854, lng: 73.7125 };
