"use client";

import { useEffect, useState } from 'react';
import { latLngToCell, gridDisk, cellToBoundary } from 'h3-js';
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from 'next/link';

// Simulation coordinates
const CENTER_LAT = 23.2599;
const CENTER_LNG = 77.4126;

export default function Dashboard() {
  const [h3Data, setH3Data] = useState<{index: string, boundary: number[][]}[]>([]);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const profile = useQuery(api.queries.users.current);

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
        <div>
          <h1>Smart Plantation</h1>
          <p>Veridian Protocol</p>
        </div>
        <div className="auth-status">
          {!isLoading && !isAuthenticated && (
            <Link href="/login" className="btn-secondary">Log In</Link>
          )}
          {isAuthenticated && profile && (
            <div className="profile-chip">
              <div className="profile-info">
                <strong>{profile.name}</strong>
                <span>{profile.role}</span>
              </div>
              <button className="btn-logout" onClick={() => signOut()}>Sign Out</button>
            </div>
          )}
        </div>
      </header>

      {!isAuthenticated && !isLoading && (
        <div className="guest-banner">
          <h2>Welcome to the Veridian Network</h2>
          <p>Please register or log in to view field assignments and manage local nodes.</p>
          <Link href="/register" className="btn-primary" style={{display: 'inline-block', textDecoration: 'none'}}>Join the Network</Link>
        </div>
      )}

      {/* Show the rest of the generic demo data as a "public ledger preview" if logged out, or actual ops if logged in */}
      <div className={`app-content ${!isAuthenticated && !isLoading ? 'blurred' : ''}`}>
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
      </div>

      <style jsx>{`
        .header { display: flex; justify-content: space-between; align-items: center; }
        .auth-status { display: flex; align-items: center; }
        .btn-secondary { padding: 8px 16px; background: rgba(255,255,255,0.1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.875rem; border: 1px solid rgba(255,255,255,0.2); }
        .profile-chip { display: flex; align-items: center; gap: 16px; background: var(--surface-highest); padding: 8px 16px; border-radius: 12px; border: 1px solid var(--outline-variant); }
        .profile-info { display: flex; flex-direction: column; }
        .profile-info strong { color: white; font-size: 0.9rem; }
        .profile-info span { color: var(--primary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .btn-logout { background: transparent; border: 1px solid rgba(255,100,100,0.3); color: #ff8a8a; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: 0.2s; }
        .btn-logout:hover { background: rgba(255,100,100,0.1); }
        .guest-banner { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; text-align: center; background: linear-gradient(to bottom, rgba(50, 200, 100, 0.05), transparent); border-radius: 16px; margin-bottom: 24px; border: 1px solid rgba(50, 200, 100, 0.2); }
        .guest-banner h2 { font-size: 1.5rem; margin-bottom: 8px; color: white; }
        .guest-banner p { margin-bottom: 24px; opacity: 0.7; }
        .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, var(--primary), var(--primary-container)); border-radius: 12px; color: #000; font-weight: 700; border: none; cursor: pointer; }
        .app-content { transition: filter 0.3s ease; }
        .app-content.blurred { filter: blur(5px); opacity: 0.4; pointer-events: none; user-select: none; }
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
