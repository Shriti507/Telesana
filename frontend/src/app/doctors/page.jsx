"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./doctors.module.css";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/doctors`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialization, doctors]);

  const filterDoctors = () => {
    let filtered = doctors;

    if (selectedSpecialization !== "All") {
      filtered = filtered.filter(
        (doctor) => doctor.specialisation === selectedSpecialization
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialisation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const specializations = [
    "All",
    ...new Set(doctors.map((doctor) => doctor.specialisation)),
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Find Your Doctor</h1>
        <p className={styles.subtitle}>
          Browse through our network of experienced healthcare professionals
        </p>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, specialization, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.specializationFilter}>
          <label className={styles.filterLabel}>Filter by Specialization:</label>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className={styles.filterSelect}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.statsBar}>
        <p className={styles.resultsCount}>
          Showing <strong>{filteredDoctors.length}</strong> doctors
        </p>
      </div>

      <div className={styles.doctorsGrid}>
        {filteredDoctors.length === 0 ? (
          <div className={styles.noResults}>
            <p>No doctors found matching your criteria.</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.cardHeader}>
                <div className={styles.doctorAvatar}>
                  {doctor.doctor_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div className={styles.doctorInfo}>
                  <h3 className={styles.doctorName}>{doctor.doctor_name}</h3>
                  <span className={styles.specialization}>
                    {doctor.specialisation}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span className={styles.infoText}>{doctor.qualification}</span>
                </div>

                <div className={styles.infoRow}>
                  <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className={styles.infoText}>
                    {doctor.experience} years experience
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className={styles.feeText}>₹{doctor.fees} consultation fee</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button className={styles.bookButton}>
                  Book Appointment
                </button>
                <button className={styles.profileButton}>View Profile</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.backButton}>
        <Link href="/">
          <button className={styles.btnBack}>← Back to Home</button>
        </Link>
      </div>
    </div>
  );
}
