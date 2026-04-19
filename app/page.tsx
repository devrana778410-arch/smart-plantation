"use client";

import { useEffect, useState } from 'react';
import { latLngToCell, gridDisk, cellToBoundary } from 'h3-js';
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useConvexAuth, useMutation } from "convex/react";
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
  const stats = useQuery(api.queries.trees.getDashboardStats);
  const updateProfile = useMutation(api.queries.users.updateProfile);

  useEffect(() => {
    // Generate actual Resolution 6 spatial cells directly from client bypassing heavy Leaflet layers
    const originCell = latLngToCell(CENTER_LAT, CENTER_LNG, 6);
    const cells = gridDisk(originCell, 1); 
    setH3Data(cells.map(c => ({
      index: c,
      boundary: cellToBoundary(c)
    })));

    // Initialize Leaflet Map safely exclusively on the client
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        import("leaflet/dist/leaflet.css").then(() => {
          // Prevent multiple initializations in React 18 strict mode
          const container = L.DomUtil.get('map');
          if (container && (container as any)._leaflet_id) {
            return;
          }

          const map = L.map('map').setView([CENTER_LAT, CENTER_LNG], 13);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          // If we had real tree locations, we would map over stats.recentFeed and add markers here
          if (stats && stats.recentFeed.length > 0) {
             // For now we just add a mock marker at the center since trees don't have lat/lng in recentfeed yet
             L.circleMarker([CENTER_LAT, CENTER_LNG], { radius: 6, color: '#4CAF50', fillColor: '#4CAF50', fillOpacity: 0.8 }).addTo(map).bindPopup("Active Plantation Node");
          }
        });
      });
    }
  }, [stats]);

  useEffect(() => {
    // Check if we have a pending profile to flush to the server
    if (isAuthenticated && profile !== undefined) {
      const pendingName = window.localStorage.getItem('pending_profile_name');
      const pendingRole = window.localStorage.getItem('pending_profile_role');
      const pendingNgoId = window.localStorage.getItem('pending_profile_ngo_id') || undefined;

      if (pendingName && pendingRole) {
        updateProfile({
          name: pendingName,
          role: pendingRole,
          ngo_id: pendingNgoId,
        }).then(() => {
          // Flush complete, clean up
          window.localStorage.removeItem('pending_profile_name');
          window.localStorage.removeItem('pending_profile_role');
          window.localStorage.removeItem('pending_profile_ngo_id');
        }).catch(err => {
          console.error("Failed to sync profile:", err);
        });
      }
    }
  }, [isAuthenticated, profile, updateProfile]);

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
            <p>Live GPS Verification Map</p>
            <small>Lat: {CENTER_LAT}, Lng: {CENTER_LNG}</small>
            
            <div id="map" style={{ height: "300px", width: "100%", borderRadius: "12px", marginTop: "16px", zIndex: 0 }}></div>
          </div>
        </div>

      <div className="metrics">
        <div className="metric-card">
          <h3>Total Trees Planted</h3>
          <p className="value">{stats ? stats.totalTrees.toLocaleString() : "..."}</p>
        </div>
        <div className="metric-card">
          <h3>Survival Rate</h3>
          <p className="value">{stats ? `${stats.survivalRate}%` : "..."}</p>
        </div>
        <div className="metric-card">
          <h3>Pending Audits</h3>
          <p className="value target">{stats ? stats.pendingAudits : "..."}</p>
        </div>
      </div>

      <div className="feed">
        <h2>Recent Inspections</h2>
        <div className="feed-list">
           {stats && stats.recentFeed.length > 0 ? (
             stats.recentFeed.map((feedItem, idx) => (
                <div key={idx} className="feed-item">
                  <div className={`feed-thumbnail ${!feedItem.is_alive ? 'dead-thumb' : ''}`}></div>
                  <div className="feed-info">
                     <strong>ID: {feedItem.tree_id}</strong>
                     <span className={feedItem.is_alive ? "status-healthy" : "status-dead"}>
                        {feedItem.is_alive ? "Healthy" : "Dead"} • {feedItem.species} 
                     </span>
                     <small> — {new Date(feedItem.ts).toLocaleDateString()}</small>
                  </div>
                </div>
             ))
           ) : (
              <p style={{opacity: 0.6, fontSize: '0.9rem'}}>No recent inspections found on the network.</p>
           )}
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
