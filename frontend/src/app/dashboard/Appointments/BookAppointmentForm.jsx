"use client"

import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../api/utils.js";
import styles from "./BookForm.module.css";
import { getCurrentUser } from "../../../lib/auth";

export default function BookAppointmentForm({ onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",       
    dob: "",        
    gender: "",     
    department: "",
    doctorId: "",
    appointmentTime: "",
    mode: "IN_PERSON"
  });

  useEffect(() => {
    async function load() {
      const docs = await apiGet("/api/doctor");
      if (Array.isArray(docs)) {
        setDoctors(docs);
        setDepartments([...new Set(docs.map(d => d.specialisation))]);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setFiltered(doctors.filter(d => d.specialisation === form.department));
  }, [form.department, doctors]);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const user = await getCurrentUser();
    if (!user) return alert("Please login again.");
    const userId = user.id;

    try {
      const queryParams = new URLSearchParams({
        userId: userId,
        fullName: form.fullName,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender
      }).toString();

      const patientRes = await fetch(`http://localhost:3001/api/patient?${queryParams}`, { 
        method: "GET",
        credentials: "include",
      });
      
      const patientData = await patientRes.json();

      if (!patientRes.ok) {
        alert(patientData.error || "Failed to fetch/create patient");
        return;
      }

      const bookingRes = await apiPost("/api/appointment", {
        userId: userId,
        patientId: patientData.id,
        doctorId: form.doctorId,
        appointmentTime: form.appointmentTime,
        mode: form.mode
      });

      if (bookingRes.error) {
        alert(bookingRes.error);
      } else {
        alert("Appointment booked successfully!");
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      
      <label>Full Name</label>
      <input type="text" name="fullName" value={form.fullName} onChange={handle} placeholder="Full Name" required />

      <label>Phone Number</label>
      <input type="tel" name="phone" value={form.phone} onChange={handle} placeholder="10-digit mobile number" required />

      <label>Gender</label>
      <select name="gender" value={form.gender} onChange={handle} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label>Date of Birth</label>
      <input type="date" name="dob" value={form.dob} onChange={handle} required />

      <label>Department</label>
      <select name="department" onChange={handle} required>
        <option value="">Select Department</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <label>Doctor</label>
      <select name="doctorId" onChange={handle} required>
        <option value="">Select Doctor</option>
        {filtered.map((doc) => <option key={doc.id} value={doc.id}>{doc.doctor_name}</option>)}
      </select>

      <label>Date & Time</label>
      <input type="datetime-local" name="appointmentTime" onChange={handle} required />

      <label>Mode</label>
      <select name="mode" onChange={handle}>
        <option value="IN_PERSON">In Person</option>
        <option value="VIDEO">Video</option>
      </select>

      <button type="submit" style={{ background: "#4A74F5", border: "none", padding: "10px", color: "white", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}>
        Book Now
      </button>
    </form>
  );
}