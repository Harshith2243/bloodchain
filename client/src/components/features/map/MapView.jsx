import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Droplets, Hospital } from 'lucide-react';

// Fix Leaflet marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const donorIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg shadow-primary-200"><span class="text-xs">🩸</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const hospitalIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-8 h-8 bg-slate-900 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg shadow-slate-200"><span class="text-xs">🏥</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Helper component to center map
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords]);
  return null;
}

export default function MapView({ donors = [], hospitals = [], center = [17.4482, 78.3914] }) {
  return (
    <div className="relative w-full h-[450px] bg-slate-900 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <RecenterMap coords={center} />

        {donors?.map?.((donor, idx) => (
          <Marker 
            key={`donor-${idx}`} 
            position={donor.coords || center} 
            icon={donorIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h5 className="font-bold text-slate-900">{donor.name}</h5>
                <p className="text-xs text-slate-500">{donor.bloodGroup} • {donor.location}</p>
                <div className="mt-2 text-[10px] font-black uppercase text-primary-600">Verified Donor</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {hospitals?.map?.((hosp, idx) => (
          <Marker 
            key={`hosp-${idx}`} 
            position={hosp.coords || [center[0] + 0.01, center[1] + 0.01]} 
            icon={hospitalIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h5 className="font-bold text-slate-900">{hosp.name}</h5>
                <p className="text-xs text-slate-500">{hosp.type || 'Regional Center'}</p>
                <div className="mt-2 text-[10px] font-black uppercase text-emerald-600">Operational</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlays */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Network Radar</span>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-bold text-white border border-white/5">
            DNR: {donors.length}
          </div>
          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-bold text-white border border-white/5">
            HSP: {hospitals.length}
          </div>
        </div>
      </div>
    </div>
  );
}
