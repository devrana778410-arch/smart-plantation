"use client";

import Link from "next/link";

export default function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In</h1>
        <p>Log in to your citizen or organization account</p>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <label>Email Address
            <input type="email" placeholder="account@example.com" />
          </label>
          <label>Secure Password
            <input type="password" placeholder="••••••••" />
          </label>
          <button className="btn-primary" type="submit">Sign In to Dashboard</button>
        </form>

        <p className="auth-footer">
          New to the initiative? <Link href="/register">Create an Account</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container { display: flex; align-items: center; justify-content: center; padding: 48px 0;width:100%; }
        .auth-card { background: var(--surface-low); padding: 48px; border-radius: 16px; width: 100%; max-width: 480px; border: 1px solid rgba(255, 255, 255, 0.05); }
        h1 { margin: 0 0 8px; font-family: 'Manrope', sans-serif; font-size: 2rem;}
        p { color: var(--primary); margin: 0 0 32px; font-weight: 500;}
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        label { display: flex; flex-direction: column; gap: 8px; font-size: 0.875rem; color: var(--on-surface); opacity: 0.8;}
        input { padding: 16px; background: var(--surface-highest); border: 1px solid var(--outline-variant); border-radius: 8px; color: white; font-family: 'Inter', sans-serif;}
        input:focus { outline: 1px solid var(--primary); background: var(--surface-high); }
        .btn-primary { padding: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-container)); border: none; border-radius: 12px; color: #000; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 12px;}
        .auth-footer { margin-top: 32px; text-align: center; color: var(--on-surface); }
        .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
}
