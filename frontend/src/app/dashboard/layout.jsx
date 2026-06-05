"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "../ui/dashboard/sidebar/sidebar"; 
import Navbar from "../ui/dashboard/navbar/navbar";   
import Chatbot from "../../components/Chatbot";       
import styles from "../ui/dashboard/dashboard.module.css"; 
import { MdMenu } from "react-icons/md"; 
import { isAuthenticated, logout } from "../../lib/auth";

const Layout = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    // Remove top padding (global navbar is hidden on dashboard)
    document.body.classList.add('dashboardPage');
    return () => {
      document.body.classList.remove('dashboardPage');
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!mounted) return;

      if (!authenticated) {
        await logout();
        router.replace('/login');
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(160deg, #1a2e6b 0%, #2952cc 60%, #3b6ef8 100%)',
        gap: 16,
      }}>
        <div style={{
          width: 48, height: 48,
          border: '4px solid rgba(255,255,255,0.2)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
          Verifying access…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const closeMenu = () => setSidebarOpen(false);

  return (
    <div className={styles.container}>
      {/* 1. Sidebar */}
      <div className={`${styles.menu} ${isSidebarOpen ? styles.mobileActive : ''}`}>
        <Sidebar />
      </div>

      {/* 2. Mobile overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      {/* 3. Content */}
      <div className={styles.content}>
        {/* Hamburger (mobile) */}
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <MdMenu size={24} color="#3b6ef8" />
        </button>

        <Navbar />
        {children}
      </div>

      <Chatbot />
    </div>
  );
};

export default Layout;