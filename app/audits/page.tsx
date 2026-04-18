"use client";

export default function AuditQueue() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Audit Dashboard</h1>
        <p>Pending Random Stratified Ground Truth Assignments</p>
      </header>

      <div className="audit-list">
         <div className="audit-card">
            <div className="audit-head">
              <span className="badge pending">Action Needed</span>
              <h3>Zone: Res-6 H3 Cell 8a62a6...</h3>
            </div>
            <p className="detail">15 Trees Assigned in Region • Assigned to You</p>
            <div className="audit-actions">
               <button className="btn-primary">Download Offline Geodata</button>
            </div>
         </div>
         
         <div className="audit-card">
            <div className="audit-head">
              <span className="badge in-progress">In Progress</span>
              <h3>Zone: Res-6 H3 Cell 8c34f1...</h3>
            </div>
            <p className="detail">32 Trees Assigned • 12 Inspected</p>
            <div className="audit-actions">
               <button className="btn-secondary">Resume Offline Sync</button>
            </div>
         </div>
      </div>

      <style jsx>{`
        .audit-list { display: flex; flex-direction: column; gap: 20px;}
        .audit-card { background: var(--surface-low); padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);}
        .audit-head { display: flex; align-items: center; gap: 16px; margin-bottom: 8px;}
        .audit-head h3 { margin: 0; font-family: 'Manrope', sans-serif;}
        .badge { padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;}
        .pending { background: rgba(255, 180, 171, 0.2); color: var(--error); border: 1px solid var(--error); }
        .in-progress { background: rgba(120, 220, 119, 0.2); color: var(--primary); border: 1px solid var(--primary); }
        .detail { opacity: 0.7; margin: 0 0 20px 0; font-family: 'Inter', sans-serif; font-size: 0.9rem;}
        .audit-actions { display: flex; gap: 12px;}
        .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, var(--primary), var(--primary-container)); border: none; border-radius: 8px; color: #000; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
        .btn-secondary { padding: 12px 24px; background: transparent; border: 1px solid var(--primary); border-radius: 8px; color: var(--primary); font-weight: 600; cursor: pointer; font-size: 0.9rem;}
      `}</style>
    </div>
  );
}
