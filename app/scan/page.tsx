"use client";
import { useState, useEffect } from "react";

export default function Scanner() {
  const [step, setStep] = useState<"scanning" | "inspecting" | "done">("scanning");

  useEffect(() => {
    if (step === "scanning") {
       // Simulate QR camera scan success after 2.5 seconds
       const timer = setTimeout(() => setStep("inspecting"), 2500);
       return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>{step === 'scanning' ? 'Field Scanner' : step === 'inspecting' ? 'Inspection Entry' : 'Log Completed'}</h1>
        <p>{step === 'scanning' ? 'Locating Target Tag Viewfinder...' : step === 'inspecting' ? 'Logging Data for QR-8821' : 'Ready for next target'}</p>
      </header>

      {step === 'scanning' && (
        <div className="scan-layout">
          <div className="scan-view">
            <div className="camera-frame">
              <div className="target-guides"></div>
              <div className="scan-line"></div>
              <p className="scanner-text">Evaluating Visuals...</p>
            </div>
          </div>
          <div className="action-bar">
             <button className="btn-secondary" onClick={() => setStep('inspecting')}>Manual QR Override</button>
          </div>
        </div>
      )}

      {step === 'inspecting' && (
        <div className="form-layout animated-entry">
           <form className="data-form" onSubmit={(e) => { e.preventDefault(); setStep('done'); }}>
             <div className="form-grid">
               <label>Tree Height (cm)
                 <input type="number" placeholder="120" required />
               </label>
               <label>Canopy Radius (cm)
                 <input type="number" placeholder="45" required />
               </label>
               <label>Stem Diameter (mm)
                 <input type="number" placeholder="18" required />
               </label>
               <label>Vitality Status
                 <select required className="status-select">
                   <option value="alive">Healthy / Alive</option>
                   <option value="struggling">Struggling / Needs Water</option>
                   <option value="dead">Dead</option>
                 </select>
               </label>
             </div>
             
             <div className="photo-upload-box">
                <div className="photo-placeholder">
                  <span>📸 Tap to Capture GPS Timestamped Photo</span>
                </div>
             </div>

             <div className="action-bar mt-24">
               <button className="btn-primary" style={{flex: 2}}>Save to Offline Ledger</button>
               <button className="btn-secondary" style={{flex: 1}} type="button" onClick={() => setStep('scanning')}>Cancel</button>
             </div>
           </form>
        </div>
      )}

      {step === 'done' && (
         <div className="success-view animated-entry">
           <div className="success-icon">✓</div>
           <h2>Inspection Logged Successfully</h2>
           <p>Data securely cached for next uplink sync to Convex.</p>
           <button className="btn-primary mt-24" onClick={() => setStep('scanning')}>Scan Next Tree</button>
         </div>
      )}

      <style jsx>{`
        .scan-view { background: var(--surface-low); padding: 24px; border-radius: 16px; margin-bottom: 24px; }
        .camera-frame { height: 450px; background: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .target-guides { position: absolute; width: 200px; height: 200px; border: 2px dashed var(--primary); border-radius: 16px; opacity: 0.8; animation: pulse 1s infinite alternate;}
        .scan-line { position: absolute; width: 100%; height: 2px; background: var(--primary); top: 0; box-shadow: 0 0 12px var(--primary); animation: scan 2.5s infinite linear; }
        .scanner-text { position: absolute; bottom: 24px; font-family: monospace; color: var(--primary); letter-spacing: 0.1em; opacity: 0.8;}
        
        .form-layout { background: var(--surface-low); padding: 32px; border-radius: 16px; }
        .photo-upload-box { margin-top: 24px; }
        .photo-placeholder { background: var(--surface-highest); border: 2px dashed var(--outline-variant); height: 160px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;}
        .photo-placeholder:hover { border-color: var(--primary); background: var(--surface-high); color: var(--primary);}
        .photo-placeholder span { font-weight: 500;}
        
        .success-view { background: var(--surface-low); padding: 64px 32px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;}
        .success-icon { width: 80px; height: 80px; background: var(--primary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: #000; font-weight: bold; margin-bottom: 24px; animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .success-view h2 { margin: 0 0 8px; font-family: 'Manrope', sans-serif;}
        .success-view p { margin: 0; opacity: 0.7;}

        .animated-entry { animation: fade-in 0.3s ease; }

        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { from { transform: scale(0.98); } to { transform: scale(1.02); } }
      `}</style>
    </div>
  );
}
