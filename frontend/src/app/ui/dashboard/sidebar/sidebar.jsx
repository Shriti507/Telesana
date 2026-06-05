"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./sidebar.module.css"
import {
  MdDashboard,
  MdOutlineSettings,
  MdSchedule,
  MdHealthAndSafety,
  MdPeople,
  MdCalendarMonth,
  MdNotifications,
  MdHeadsetMic,
} from "react-icons/md";

import DashboardLink from './dashboardLink/dashboardLink';
import { getCurrentUser } from "../../../../lib/auth";

const dashboardItems = [
  {
    title: "Main",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Notifications",
        path: "/dashboard/notifications",
        icon: <MdNotifications />,
      },
      {
        title: "Calendar",
        path: "/dashboard/calendar",
        icon: <MdCalendarMonth />,
      },
      {
        title: "User Profile",
        path: "/dashboard/userDetails",
        icon: <MdPeople />,
      },
      {
        title: "Appointments",
        path: "/dashboard/Appointments",
        icon: <MdSchedule />,
      },
    ],
  },

  {
    title: "Preferences",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
    ],
  },
];


const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadCurrentUser();
  }, []);

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logoArea}>
        <span className={styles.logoText}>
          Tele<span className={styles.logoDot}>sana</span>
        </span>
      </div>

      {/* User card */}
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src="/noavatar.png"
          alt="User avatar"
          width={44}
          height={44}
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user?.username || 'User'}</span>
          <span className={styles.userEmail}>{user?.email || 'user@telesana.com'}</span>
        </div>
      </div>

      {/* Nav items */}
      <ul className={styles.list}>
        {dashboardItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <DashboardLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>

      <div className={styles.spacer} />

      {/* Help card */}
      <div className={styles.helpCard}>
        <p>Need support or have questions?</p>
        <a href="/contact" className={styles.helpBtn}>
          <MdHeadsetMic style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Get Help
        </a>
      </div>
    </div>
  );
};

export default Sidebar
