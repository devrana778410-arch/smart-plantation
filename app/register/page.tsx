"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [accountType, setAccountType] = useState('citizen');
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        flow: "signUp",
      });
      router.push("/");
    } catch (err) {
      setError("Registration failed. That email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join Smart Plantation</h1>
        <p>Register as a citizen or organization to start planting</p>
        
        <div className="account-type-toggle">
           <button 
             className={accountType === 'citizen' ? 'active' : ''} 
             onClick={() => setAccountType('citizen')}
           >
             Individual / Citizen
           </button>
           <button 
             className={accountType === 'ngo' ? 'active' : ''} 
             onClick={() => setAccountType('ngo')}
           >
             Organization
           </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <label>Full Name / Display Name
            <input name="name" type="text" placeholder="John Doe" required />
          </label>
          <label>Email Address
            <input name="email" type="email" placeholder="john@example.com" required />
          </label>

          {accountType === 'ngo' && (
             <label>Organization Handle (Optional)
               <input name="ngo_slug" type="text" placeholder="green-earth-initiative" />
             </label>
          )}

          <label>Secure Password
            <input name="password" type="password" placeholder="••••••••" required />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link href="/login">Return to Login</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container { display: flex; align-items: center; justify-content: center; padding: 48px 0; width: 100%;}
        .auth-card { background: var(--surface-low); padding: 48px; border-radius: 16px; width: 100%; max-width: 480px; border: 1px solid rgba(255, 255, 255, 0.05); }
        h1 { margin: 0 0 8px; font-family: 'Manrope', sans-serif; font-size: 2rem;}
        p { color: var(--primary); margin: 0 0 24px; font-weight: 500;}
        .account-type-toggle { display: flex; gap: 8px; margin-bottom: 24px; background: var(--surface-highest); padding: 6px; border-radius: 12px; }
        .account-type-toggle button { flex: 1; padding: 12px; border: none; background: transparent; color: var(--on-surface); border-radius: 8px; cursor: pointer; font-family: 'Inter'; font-weight: 600; opacity: 0.6; transition: 0.2s; }
        .account-type-toggle button.active { opacity: 1; background: var(--surface-high); color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-error { padding: 12px; background: rgba(255, 180, 171, 0.1); border: 1px solid var(--error); color: var(--error); border-radius: 8px; font-size: 0.875rem; text-align: center; }
        label { display: flex; flex-direction: column; gap: 6px; font-size: 0.875rem; color: var(--on-surface); opacity: 0.8;}
        input { padding: 16px; background: var(--surface-highest); border: 1px solid var(--outline-variant); border-radius: 8px; color: white; font-family: 'Inter', sans-serif;}
        input:focus { outline: 1px solid var(--primary); background: var(--surface-high); }
        .btn-primary { padding: 16px; background: linear-gradient(135deg, var(--primary), var(--primary-container)); border: none; border-radius: 12px; color: #000; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 12px;}
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-footer { margin-top: 32px; text-align: center; color: var(--on-surface); }
        .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
}
