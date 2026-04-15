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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying access...</p>
      </div>
    );
  }

  
  const closeMenu = () => setSidebarOpen(false);

  return (
    <div className={styles.container}>
      
      {/* 1. The Sidebar (Desktop: Always visible | Mobile: Hidden until toggled) */}
      <div className={`${styles.menu} ${isSidebarOpen ? styles.mobileActive : ''}`}>
        <Sidebar />
      </div>

      {/* 2. Background Overlay (Only visible on mobile when menu is open) */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}

      
      <div className={styles.content}>
        {/* Hamburger Menu Button (Mobile Only) */}
        <button className={styles.menuBtn} onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <MdMenu size={28} color="#107ecc" />
        </button>
        
        <Navbar />
        {children}
      </div>
      
      <Chatbot />
    </div>
  );
};

export default Layout;