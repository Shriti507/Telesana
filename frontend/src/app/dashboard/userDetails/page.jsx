"use client";
import React, { useState, useEffect } from "react";
import styles from "./userDetails.module.css";
import toast from "react-hot-toast";
import { getCurrentUser } from "../../../lib/auth";

const genderMap = { M: "MALE", F: "FEMALE", Other: "OTHER" };
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "M",
    dob: "",
    height: "",
    weight: "",
    bloodGroup: "",
    age: ""
  });

  useEffect(() => {
    const loadPageData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await fetchProfile();
    };

    loadPageData();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patient/profile`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        setFormData({
          fullName: data.fullName,
          phone: data.phone || "",
          gender: data.gender === "MALE" ? "M" : data.gender === "FEMALE" ? "F" : "Other",
          dob: data.dob?.split("T")[0],
          height: data.height ?? "",
          weight: data.weight ?? "",
          bloodGroup: data.bloodGroup ?? "",
          age: calculateAge(data.dob)
        });
      } else if (response.status === 404) {
        setIsEditing(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.fullName || !formData.dob || !formData.gender) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    const method = patient ? "PUT" : "POST";

    // Convert fields safely
    const payload = {
      fullName: formData.fullName,
      gender: formData.gender,
      dob: formData.dob || null,
      phone: formData.phone?.trim() || null,
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      bloodGroup: formData.bloodGroup || null,
    };

    const response = await fetch(`${API_BASE_URL}/api/patient/profile`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Profile saved");
      fetchProfile();
      setIsEditing(false);
    } else {
      toast.error(data.message || "Failed to save profile");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>User Profile</h1>
        {patient && !isEditing && (
          <button className={styles.editButton} onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {/* Account Info */}
      {user && (
        <div className={styles.accountInfo}>
          <h2>Account Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Username</label>
              <p>{user.username}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className={styles.profileSection}>
        <h2>Personal Information</h2>

        {isEditing ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={styles.input}
              />
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label>Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={styles.input}
                required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DOB */}
            <div className={styles.formGroup}>
              <label>Date of Birth *</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value, age: calculateAge(e.target.value) })}
                className={styles.input}
                required
              />
            </div>

            {/* Age */}
            <div className={styles.formGroup}>
              <label>Age</label>
              <input type="number" value={formData.age} readOnly className={styles.input} />
            </div>

            {/* Height */}
            <div className={styles.formGroup}>
              <label>Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className={styles.input}
              />
            </div>

            {/* Weight */}
            <div className={styles.formGroup}>
              <label>Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className={styles.input}
              />
            </div>

            {/* Blood Group */}
            <div className={styles.formGroup}>
              <label>Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className={styles.input}
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>Save</button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: patient.fullName,
                    phone: patient.phone || "",
                    gender: patient.gender === "MALE" ? "M" : patient.gender === "FEMALE" ? "F" : "Other",
                    dob: patient.dob?.split("T")[0],
                    height: patient.height ?? "",
                    weight: patient.weight ?? "",
                    bloodGroup: patient.bloodGroup ?? "",
                    age: calculateAge(patient.dob)
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : patient ? (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Full Name</label>
              <p>{patient.fullName}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Phone</label>
              <p>{patient.phone ?? "Not provided"}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Gender</label>
              <p>{patient.gender === "MALE" ? "Male" : patient.gender === "FEMALE" ? "Female" : "Other"}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Date of Birth</label>
              <p>{new Date(patient.dob).toLocaleDateString()}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Age</label>
              <p>{calculateAge(patient.dob)}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Height (cm)</label>
              <p>{patient.height ?? "Not provided"}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Weight (kg)</label>
              <p>{patient.weight ?? "Not provided"}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Blood Group</label>
              <p>{patient.bloodGroup ?? "Not provided"}</p>
            </div>
          </div>
        ) : (
          <p className={styles.noData}>Please create your profile</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
