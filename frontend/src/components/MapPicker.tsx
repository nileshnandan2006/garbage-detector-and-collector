import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Report, Hotspot } from '../types/index.js';

interface MapPickerProps {
  mode?: 'picker' | 'viewer';
  initialLat?: number;
  initialLon?: number;
  onLocationSelect?: (lat: number, lon: number) => void;
  reports?: Report[];
  hotspots?: Hotspot[];
  height?: string;
  selectedReportId?: string;
  onReportClick?: (report: Report) => void;
}

// Marker Color Resolver based on CleanSight requirement:
// Red = New garbage report (PENDING AI VERIFICATION / VERIFIED)
// Orange = Assigned (ASSIGNED / COLLECTOR ON THE WAY)
// Blue = Cleaning in progress
// Green = Cleaned (CLEANED / CLOSED)
function getMarkerColor(status: string): string {
  switch (status) {
    case 'CLEANED':
    case 'CLOSED':
      return '#10b981'; // Green
    case 'CLEANING IN PROGRESS':
      return '#0284c7'; // Blue
    case 'ASSIGNED':
    case 'COLLECTOR ON THE WAY':
      return '#f97316'; // Orange
    case 'REJECTED':
      return '#64748b'; // Gray
    case 'PENDING AI VERIFICATION':
    case 'VERIFIED':
    default:
      return '#ef4444'; // Red
  }
}

function createCustomPin(color: string, label?: string) {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
      ">
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        "></div>
        <div style="
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          top: 8px;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function createHotspotPin(cleanlinessScore: number) {
  const color = cleanlinessScore < 40 ? '#dc2626' : cleanlinessScore < 60 ? '#ea580c' : '#eab308';
  return L.divIcon({
    className: 'custom-hotspot-pin',
    html: `
      <div style="
        background: ${color};
        color: white;
        font-weight: 800;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 9999px;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>🔥</span>
        <span>Score: ${cleanlinessScore}</span>
      </div>
    `,
    iconSize: [90, 28],
    iconAnchor: [45, 14]
  });
}

export const MapPicker: React.FC<MapPickerProps> = ({
  mode = 'picker',
  initialLat = 18.5204, // Pune center
  initialLon = 73.8567,
  onLocationSelect,
  reports = [],
  hotspots = [],
  height = '360px',
  selectedReportId,
  onReportClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([initialLat, initialLon], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Picker mode click handler
      if (mode === 'picker') {
        const pickerIcon = createCustomPin('#10b981');
        const marker = L.marker([initialLat, initialLon], {
          icon: pickerIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onLocationSelect) onLocationSelect(pos.lat, pos.lng);
        });

        pickerMarkerRef.current = marker;

        map.on('click', (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          if (onLocationSelect) onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update picker marker position if initial coordinates change
  useEffect(() => {
    if (mode === 'picker' && pickerMarkerRef.current && mapInstanceRef.current) {
      pickerMarkerRef.current.setLatLng([initialLat, initialLon]);
      mapInstanceRef.current.setView([initialLat, initialLon], 14);
    }
  }, [initialLat, initialLon, mode]);

  // Update viewer mode markers
  useEffect(() => {
    if (mode !== 'viewer' || !mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Render reports
    reports.forEach((rep) => {
      if (!rep.latitude || !rep.longitude) return;

      const pinColor = getMarkerColor(rep.status);
      const icon = createCustomPin(pinColor);

      const marker = L.marker([rep.latitude, rep.longitude], { icon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 2px;">
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #0f172a;">${rep.area}</div>
          <div style="display: flex; gap: 4px; margin-bottom: 6px;">
            <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${rep.category}</span>
            <span style="background: ${pinColor}20; color: ${pinColor}; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${rep.status}</span>
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px; line-height: 1.3;">${rep.address}</div>
          ${rep.image_url ? `<img src="${rep.image_url}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 4px;" />` : ''}
          <div style="font-weight: 600; color: #059669; font-size: 11px;">Reward: +${rep.reward_points} pts</div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onReportClick) onReportClick(rep);
      });

      markersLayerRef.current!.addLayer(marker);
    });

    // Render hotspots if provided
    hotspots.forEach((h) => {
      if (!h.latitude || !h.longitude) return;
      const icon = createHotspotPin(h.cleanliness_score);
      const marker = L.marker([h.latitude, h.longitude], { icon });
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 2px;">
          <div style="font-weight: 700; color: #b91c1c; font-size: 13px;">🔥 HOTSPOT: ${h.area_name}</div>
          <div style="margin: 4px 0;">Cleanliness Score: <b>${h.cleanliness_score}/100</b></div>
          <div>Unresolved Reports: <b>${h.unresolved_reports}</b> of ${h.total_reports}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 4px;">Severity: ${h.severity}</div>
        </div>
      `);
      markersLayerRef.current!.addLayer(marker);
    });

    // Adjust bounds if markers exist
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map((r) => [r.latitude, r.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
    }
  }, [reports, hotspots, mode]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay in Viewer Mode */}
      {mode === 'viewer' && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700">Markers:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-600">New Report</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-600">Assigned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500"></span>
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Cleaned</span>
          </div>
        </div>
      )}
    </div>
  );
};
