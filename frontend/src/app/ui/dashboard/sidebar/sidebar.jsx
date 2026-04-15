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
} from "react-icons/md";

import DashboardLink from './dashboardLink/dashboardLink';
import { getCurrentUser } from "../../../../lib/auth";

const dashboardItems = [
  {
    title: "User",
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
    title: "Settings",
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
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src="/noavatar.png"
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user?.username || 'User'}</span>
          <span className={styles.userEmail}>{user?.email || ''}</span>
        </div>
      </div>
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

    </div>
  );
};

export default Sidebar
