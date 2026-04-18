"use client";

import { useState } from "react";

export default function RegisterTree() {
  const [gpsStatus, setGpsStatus] = useState("Acquiring Satellite Lock...");

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Plant & Register</h1>
        <p>Initialize a new sapling into the ledger</p>
      </header>

      <div className="form-layout">
        <div className="left-panel">
          <div className="gps-card">
             <div className="gps-target"></div>
             <h3>{gpsStatus}</h3>
             <small>Lat: 23.4112 • Lng: 77.2941</small>
             <button className="btn-secondary mt-12" onClick={() => setGpsStatus("GPS Secured: +/- 4m accuracy")}>
               Ping GPS Device
             </button>
          </div>
        </div>
        
        <div className="right-panel">
           <form className="data-form" onSubmit={(e) => e.preventDefault()}>
             <label>QR Tag ID (Scan or Type)
               <input type="text" placeholder="QR-9943XZ" />
             </label>
             <label>Species Name
               <input type="text" placeholder="e.g. Ficus Religiosa (Peepal)" />
             </label>
             <label>Planter / Responsible Citizen
               <input type="text" placeholder="Current User Name" disabled />
             </label>
             <button className="btn-primary mt-24">Commit to Ledger (Offline Queue)</button>
           </form>
        </div>
      </div>

      <style jsx>{`
        .form-layout { display: flex; gap: 32px; background: var(--surface-low); padding: 32px; border-radius: 16px; margin-bottom: 32px; }
        .left-panel { flex: 1; }
        .right-panel { flex: 1.5; }
        
        .gps-card { background: var(--surface-highest); padding: 32px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center;}
        .gps-target { width: 80px; height: 80px; border: 2px dashed var(--primary); border-radius: 50%; margin-bottom: 16px; animation: pulse 2s infinite;}
        
        @keyframes pulse {
           0% { transform: scale(0.95); opacity: 0.5; }
           50% { transform: scale(1); opacity: 1; border-color: white;}
           100% { transform: scale(0.95); opacity: 0.5; }
        }

        .data-form { display: flex; flex-direction: column; gap: 20px; }
        label { display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem; color: var(--on-surface); opacity: 0.8; font-weight: 500;}
        input { padding: 16px; background: var(--surface-highest); border: 1px solid var(--outline-variant); border-radius: 8px; color: white; font-family: 'Inter', sans-serif;}
        input:focus { outline: 1px solid var(--primary); background: var(--surface-high); }
        input:disabled { opacity: 0.5; }
        
        .btn-primary { padding: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-container)); border: none; border-radius: 12px; color: #000; font-weight: 700; font-size: 1rem; cursor: pointer; }
        .btn-secondary { padding: 12px 16px; background: transparent; border: 1px solid var(--outline-variant); border-radius: 8px; color: var(--on-surface); font-weight: 600; cursor: pointer;}
        .mt-12 { margin-top: 12px;}
        .mt-24 { margin-top: 24px;}

        @media (max-width: 768px) {
          .form-layout { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
