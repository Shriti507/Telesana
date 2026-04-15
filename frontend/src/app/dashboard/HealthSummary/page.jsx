"use client";
import React, { useState, useEffect } from 'react';
import styles from './healthSummary.module.css';
import { MdFavorite, MdWaterDrop, MdThermostat, MdMonitorWeight } from 'react-icons/md';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const HealthSummaryPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthPassbook();
  }, []);

  const fetchHealthPassbook = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health/passbook`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setHealthData(data.healthPassbook);
        setPrescriptions(data.recentPrescriptions || []);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'LOW':
        return '#16a34a';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
      default:
        return '#94979c';
    }
  };

  const vitalMetrics = [
    {
      title: "Heart Rate",
      value: healthData?.healthData?.heartRate || "72 bpm",
      icon: <MdFavorite size={32} />,
      color: "#ef4444"
    },
    {
      title: "Blood Pressure",
      value: healthData?.healthData?.bloodPressure || "120/80",
      icon: <MdThermostat size={32} />,
      color: "#337af5"
    },
    {
      title: "Blood Glucose",
      value: healthData?.healthData?.bloodGlucose || "95 mg/dL",
      icon: <MdWaterDrop size={32} />,
      color: "#16a34a"
    },
    {
      title: "Weight",
      value: healthData?.healthData?.weight || "70 kg",
      icon: <MdMonitorWeight size={32} />,
      color: "#f59e0b"
    }
  ];

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Health Summary</h1>
        {healthData && (
          <span
            className={styles.riskBadge}
            style={{ backgroundColor: getRiskLevelColor(healthData.riskLevel) }}
          >
            {healthData.riskLevel} RISK
          </span>
        )}
      </div>

      {!healthData ? (
        <div className={styles.noData}>
          <p>No health data available. Please complete your profile and consult with a doctor.</p>
        </div>
      ) : (
        <>
          <div className={styles.vitalsSection}>
            <h2>Vital Signs</h2>
            <div className={styles.vitalsGrid}>
              {vitalMetrics.map((metric) => (
                <div key={metric.title} className={styles.vitalCard}>
                  <div
                    className={styles.vitalIcon}
                    style={{ backgroundColor: metric.color + '20', color: metric.color }}
                  >
                    {metric.icon}
                  </div>
                  <div className={styles.vitalInfo}>
                    <p className={styles.vitalLabel}>{metric.title}</p>
                    <h3 className={styles.vitalValue}>{metric.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.prescriptionsSection}>
            <h2>Recent Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <p className={styles.noPrescriptions}>No prescriptions available</p>
            ) : (
              <div className={styles.prescriptionsGrid}>
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className={styles.prescriptionCard}>
                    <div className={styles.prescriptionHeader}>
                      <h3>Dr. {prescription.doctor.doctor_name}</h3>
                      <span className={styles.prescriptionDate}>
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.prescriptionBody}>
                      <p><strong>Specialization:</strong> {prescription.doctor.specialisation}</p>
                      <p><strong>Medicines:</strong> {prescription.medicines}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HealthSummaryPage;