"use client";

import { useEffect, useState } from 'react';
import { latLngToCell, gridDisk, cellToBoundary } from 'h3-js';

// Simulation coordinates
const CENTER_LAT = 23.2599;
const CENTER_LNG = 77.4126;

export default function Dashboard() {
  const [h3Data, setH3Data] = useState<{index: string, boundary: number[][]}[]>([]);

  useEffect(() => {
    // Generate actual Resolution 6 spatial cells directly from client bypassing heavy Leaflet layers
    const originCell = latLngToCell(CENTER_LAT, CENTER_LNG, 6);
    const cells = gridDisk(originCell, 1); 
    
    setH3Data(cells.map(c => ({
      index: c,
      boundary: cellToBoundary(c)
    })));
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Smart Plantation</h1>
        <p>Veridian Protocol</p>
      </header>

      <div className="map-view">
        <div className="map-placeholder">
          <p>H3 Geospatial Matrix Online</p>
          <small>Lat: {CENTER_LAT}, Lng: {CENTER_LNG}</small>
          
          <div className="h3-preview-list">
            {h3Data.length > 0 ? h3Data.map(d => (
              <div key={d.index} className="h3-chip">
                <span>{d.index}</span>
                <small>{d.boundary[0][0].toFixed(3)}°, {d.boundary[0][1].toFixed(3)}°</small>
              </div>
            )) : <span>Processing arrays...</span>}
          </div>
        </div>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <h3>Total Trees Planted</h3>
          <p className="value">124,500</p>
        </div>
        <div className="metric-card">
          <h3>Survival Rate</h3>
          <p className="value">92.4%</p>
        </div>
        <div className="metric-card">
          <h3>Pending Audits</h3>
          <p className="value target">12</p>
        </div>
      </div>

      <div className="feed">
        <h2>Recent Inspections</h2>
        <div className="feed-list">
           <div className="feed-item">
              <div className="feed-thumbnail"></div>
              <div className="feed-info">
                 <strong>ID: QR-8349</strong>
                 <span className="status-healthy">Healthy • 2 mins ago</span>
              </div>
           </div>
           <div className="feed-item">
              <div className="feed-thumbnail dead-thumb"></div>
              <div className="feed-info">
                 <strong>ID: QR-1102</strong>
                 <span className="status-dead">Dead   • 45 mins ago</span>
              </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .h3-preview-list {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 16px;
        }
        .h3-chip {
          background: var(--background);
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--primary-container);
          text-align: center;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
        }
        .h3-chip span {
          display: block;
          font-family: monospace;
          font-weight: 700;
          color: var(--primary);
        }
        .h3-chip small {
          display: block;
          font-family: monospace;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
