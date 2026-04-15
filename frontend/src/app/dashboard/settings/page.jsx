"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';
import toast from 'react-hot-toast';
import { logout } from '../../../lib/auth';

const SettingsPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.section}>
        <h2>Account</h2>
        <div className={styles.settingItem}>
          <div>
            <h3>Logout</h3>
            <p>Sign out of your account</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>About</h2>
        <div className={styles.infoItem}>
          <p><strong>Application:</strong> TeleSana</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Description:</strong> Healthcare management platform</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
