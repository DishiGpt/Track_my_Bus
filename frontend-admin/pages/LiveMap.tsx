
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MAP_CENTER, MAP_ZOOM, UDAIPUR_ROUTES } from '../../constants';
import { BusFront, Activity } from 'lucide-react';

const LiveMapPage: React.FC = () => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // Mock fleet positions for display
  const fleet = [
    { id: "B1", route: "1", lat: 24.5854, lng: 73.7125, status: 'On Route' },
    { id: "B2", route: "7", lat: 24.5910, lng: 73.7220, status: 'Delayed' },
    { id: "B3", route: "2", lat: 24.5750, lng: 73.7050, status: 'On Route' },
  ];

  const mapOptions = {
    disableDefaultUI: true,
    styles: [
      { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{"color": "#ffffff"}] },
      { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"color": "#000000"}, {"lightness": 13}] },
      { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 20}] },
      { "featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 20}] },
      { "featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 21}] },
      { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 17}] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#0e1726"}] }
    ]
  };

  return (
    <div className="h-full w-full bg-slate-900 rounded-[40px] overflow-hidden relative border-4 border-slate-800 shadow-2xl">
      <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
        <div className="bg-indigo-500 p-2 rounded-xl"><Activity size={20} className="text-white" /></div>
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Operations</div>
          <div className="text-sm font-bold text-white uppercase">3 Vehicles Active</div>
        </div>
      </div>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          options={mapOptions}
        >
          {fleet.map(bus => (
            <Marker 
              key={bus.id} 
              position={{ lat: bus.lat, lng: bus.lng }} 
              label={{
                text: bus.route,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '10px'
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                fillColor: bus.status === 'Delayed' ? '#ef4444' : '#3b82f6',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 1.2
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold italic">
          Relaying Satellite Stream...
        </div>
      )}
    </div>
  );
};

export default LiveMapPage;
