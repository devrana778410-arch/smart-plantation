"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Only access navigator in the browser
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    }
  }, []);

  const navItem = (href: string, label: string) => (
    <li>
      <Link href={href} className={pathname === href ? 'active' : ''}>
        {label}
      </Link>
    </li>
  );

  return (
    <nav className="desktop-nav">
      <div className="nav-brand">SMART PLANTATION</div>
      <ul className="nav-links">
        {navItem('/', 'Dashboard')}
        {navItem('/register-tree', 'Plant Tree')}
        {navItem('/scan', 'Inspect / Scan')}
        {navItem('/audits', 'My Audits')}
        <li style={{ marginTop: 24, marginBottom: 8 }}><small className="nav-category">ACCOUNT</small></li>
        {navItem('/login', 'Sign In')}
        {navItem('/register', 'Sign Up')}
      </ul>

      <div className="sync-status">
         <div className={`status-orb ${isOnline ? 'online' : 'offline'}`}></div>
         <span>{isOnline ? 'Synced & Live' : 'Offline Storage Active'}</span>
      </div>
    </nav>
  );
}
