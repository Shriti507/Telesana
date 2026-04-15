"use client";
import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredAppointment, setHoveredAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentTime);
      return aptDate.getDate() === date &&
             aptDate.getMonth() === currentDate.getMonth() &&
             aptDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDate(day);
      const isToday = day === new Date().getDate() &&
                     currentDate.getMonth() === new Date().getMonth() &&
                     currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`${styles.day} ${isToday ? styles.today : ''} ${dayAppointments.length > 0 ? styles.hasAppointment : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {dayAppointments.length > 0 && (
            <div className={styles.appointmentIndicators}>
              {dayAppointments.map((apt, idx) => (
                <div
                  key={apt.id}
                  className={styles.appointmentDot}
                  onMouseEnter={() => setHoveredAppointment(apt)}
                  onMouseLeave={() => setHoveredAppointment(null)}
                  title={`Dr. ${apt.doctor.doctor_name}`}
                >
                  {hoveredAppointment && hoveredAppointment.id === apt.id && (
                    <div className={styles.tooltip}>
                      <p className={styles.tooltipTitle}>Dr. {apt.doctor.doctor_name}</p>
                      <p className={styles.tooltipDetail}>{apt.doctor.specialisation}</p>
                      <p className={styles.tooltipTime}>
                        {new Date(apt.appointmentTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className={styles.tooltipMode}>{apt.mode.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className={styles.container}>
      <div className={styles.calendarSection}>
        <div className={styles.header}>
          <h1 className={styles.title}>Appointment Calendar</h1>
          <div className={styles.navigation}>
            <button onClick={previousMonth} className={styles.navButton}>
              <MdChevronLeft size={24} />
            </button>
            <span className={styles.monthName}>{monthName}</span>
            <button onClick={nextMonth} className={styles.navButton}>
              <MdChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className={styles.calendar}>
          <div className={styles.weekDays}>
            {weekDays.map(day => (
              <div key={day} className={styles.weekDay}>{day}</div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className={styles.appointmentDetails}>
          <h2>Appointments on {currentDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDate}</h2>
          {selectedDateAppointments.length === 0 ? (
            <p className={styles.noAppointments}>No appointments scheduled</p>
          ) : (
            <div className={styles.appointmentsList}>
              {selectedDateAppointments.map(apt => (
                <div key={apt.id} className={styles.appointmentCard}>
                  <div className={styles.cardHeader}>
                    <h3>Dr. {apt.doctor.doctor_name}</h3>
                    <span className={styles.time}>
                      {new Date(apt.appointmentTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p><strong>Specialization:</strong> {apt.doctor.specialisation}</p>
                  <p><strong>Mode:</strong> {apt.mode.replace('_', ' ')}</p>
                  <p><strong>Status:</strong> <span className={styles.statusBadge}>{apt.status}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
