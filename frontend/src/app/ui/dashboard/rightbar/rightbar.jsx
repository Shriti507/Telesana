'use client';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './rightbar.module.css';
import { MdNotifications, MdEvent, MdMedication } from "react-icons/md";

const reminders = [
  {
    id: 1,
    title: 'Take Antibiotics',
    time: 'After Lunch — 2:00 PM',
    icon: <MdMedication />,
    color: 'linear-gradient(135deg, #f87171, #ef4444)',
  },
  {
    id: 2,
    title: 'Book Follow-up',
    time: 'Before Friday',
    icon: <MdEvent />,
    color: 'linear-gradient(135deg, #3b6ef8, #6366f1)',
  },
  {
    id: 3,
    title: 'Blood Pressure Check',
    time: 'Tomorrow, 9:00 AM',
    icon: <MdNotifications />,
    color: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
];

const Rightbar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className={styles.container}>
      {/* Calendar */}
      <div className={styles.calendarCard}>
        <Calendar
          onChange={setDate}
          value={date}
          className={styles.calendar}
          locale="en-US"
        />
      </div>

      {/* Reminders */}
      <div className={styles.remindersCard}>
        <h3 className={styles.sectionTitle}>Reminders</h3>
        {reminders.map((r) => (
          <div className={styles.notification} key={r.id}>
            <div
              className={styles.iconContainer}
              style={{ background: r.color }}
            >
              {r.icon}
            </div>
            <div className={styles.text}>
              <span className={styles.notifTitle}>{r.title}</span>
              <span className={styles.notifTime}>{r.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightbar;