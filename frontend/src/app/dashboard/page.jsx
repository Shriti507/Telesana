"use client";
import React, { useState, useEffect } from 'react';
import Card from "../ui/dashboard/card/card";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Upcoming from "../ui/dashboard/upcoming/upcoming";
import styles from "../ui/dashboard/dashboard.module.css";
import { MdFavorite, MdWaterDrop, MdThermostat } from "react-icons/md";
import Prescriptions from "../ui/dashboard/prescription/prescription";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchHealthData();
    fetchAppointments();
  }, []);

  const fetchHealthData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health/passbook`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setHealthData(data.healthPassbook);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const cards = [
    {
      title: "Heart Rate",
      value: healthData?.healthData?.heartRate || "72 bpm",
      icon: <MdFavorite size={22} color="#ef4444" />,
      iconBg: "linear-gradient(135deg, #fee2e2, #fecaca)",
      change: {
        value: "+2%",
        isPositive: true,
        status: "Normal",
      },
    },
    {
      title: "Blood Pressure",
      value: healthData?.healthData?.bloodPressure || "120/80",
      icon: <MdThermostat size={22} color="#8b5cf6" />,
      iconBg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
      change: {
        value: "Normal",
        isPositive: true,
        status: "Healthy",
      },
    },
    {
      title: "Blood Glucose",
      value: healthData?.healthData?.bloodGlucose || "95 mg/dL",
      icon: <MdWaterDrop size={22} color="#0ea5e9" />,
      iconBg: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
      change: {
        value: "-5%",
        isPositive: true,
        status: "Fasting",
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.title} />
          ))}
        </div>

        <Upcoming appointments={appointments} />
        <Prescriptions />
      </div>

      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
