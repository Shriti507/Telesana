"use client";
import React, { useState, useEffect } from 'react';
import styles from './appointments.module.css';
import toast from 'react-hot-toast';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: '',
    mode: 'VIDEO',
    appointmentTime: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const generateTimeSlots = () => {
    const slots = []
    let start = 9
    const end = 19

    for (let i = start; i < end; i++) {
      slots.push(`${i < 10 ? '0' + i : i}:00`)
      slots.push(`${i < 10 ? '0' + i : i}:30`)
    }
    return slots
  }

  const isSlotAvailable = (timeSlot) => {
  
    const slotDateTime = new Date(`${selectedDate}T${timeSlot}`)
    const now = new Date()
    if (slotDateTime < now) {
      return false
    }

    const isBooked = appointments.some(appt => {
      const apptDate = new Date(appt.appointmentTime)
      return appt.doctor.id == formData.doctorId && 
             apptDate.getTime() === slotDateTime.getTime() &&
             appt.status !== 'CANCELLED';
  })
  return !isBooked
}

const handleSlotClick = (timeSlot) => {
  setSelectedSlot(timeSlot)
  setFormData({ 
      ...formData, 
      appointmentTime: `${selectedDate}T${timeSlot}` 
  })
}

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors`, {
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setDoctors(data);
        } else {
          // Use demo doctors if database is empty
          setDemoDoctors();
        }
      } else {
        // Use demo doctors if API fails
        setDemoDoctors();
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Use demo doctors as fallback
      setDemoDoctors();
    }
  };

  const setDemoDoctors = () => {
    const demoDoctors = [
      { id: 1, doctor_name: 'Sarah Smith', specialisation: 'Cardiology', qualification: 'MD, FACC', experience: 15, fees: 500 },
      { id: 2, doctor_name: 'John Doe', specialisation: 'General Physician', qualification: 'MBBS, MD', experience: 10, fees: 300 },
      { id: 3, doctor_name: 'Emily Chen', specialisation: 'Dermatology', qualification: 'MD, Dermatology', experience: 8, fees: 400 },
      { id: 4, doctor_name: 'Michael Brown', specialisation: 'Orthopedics', qualification: 'MS, Orthopedics', experience: 12, fees: 600 },
      { id: 5, doctor_name: 'Lisa Johnson', specialisation: 'Pediatrics', qualification: 'MD, Pediatrics', experience: 9, fees: 350 }
    ];
    setDoctors(demoDoctors);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.doctorId || !formData.appointmentTime) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowBookingForm(false);
        setFormData({ doctorId: '', mode: 'VIDEO', appointmentTime: '' });
        fetchAppointments();
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return '#16a34a';
      case 'COMPLETED':
        return '#337af5';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#94979c';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Appointments</h1>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className={styles.bookButton}
        >
          {showBookingForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {showBookingForm && (
        <div className={styles.bookingForm}>
          <h2>Book New Appointment</h2>
          <form onSubmit={handleBooking}>
            <div className={styles.formGroup}>
              <label>Select Doctor *</label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className={styles.input}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.doctor_name} - {doctor.specialisation}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Appointment Mode *</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className={styles.input}
                required
              >
                <option value="VIDEO">Video Consultation</option>
                <option value="IN_PERSON">In-Person</option>
              </select>
            </div>

            <div className={styles.formGroup}>
            <label>Appointment Date *</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
              }}
              className={styles.input}
              required
            />
          </div>
          {formData.doctorId && (
            <div className={styles.formGroup}>
              <label>Available Slots for {selectedDate} *</label>
              <div className={styles.slotsGrid}>
                {generateTimeSlots().map((slot) => {
                  const available = isSlotAvailable(slot);
                  return (
                    <button
                      key={slot}
                      type="button" 
                      disabled={!available}
                      onClick={() => handleSlotClick(slot)}
                      className={`${styles.slotButton} ${selectedSlot === slot ? styles.activeSlot : ''} ${!available ? styles.disabledSlot : ''}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
        )}

            <button type="submit" className={styles.submitButton}>
              Confirm Booking
            </button>
          </form>
        </div>
      )}

      <div className={styles.appointmentsList}>
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className={styles.noData}>No appointments found</p>
        ) : (
          <div className={styles.grid}>
            {appointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentCard}>
                <div className={styles.cardHeader}>
                  <h3>Dr. {appointment.doctor.doctor_name}</h3>
                  <span
                    className={styles.status}
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Specialization:</strong> {appointment.doctor.specialisation}</p>
                  <p><strong>Mode:</strong> {appointment.mode.replace('_', ' ')}</p>
                  <p><strong>Date & Time:</strong> {new Date(appointment.appointmentTime).toLocaleString()}</p>
                  <p><strong>Fees:</strong> ₹{appointment.doctor.fees}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
