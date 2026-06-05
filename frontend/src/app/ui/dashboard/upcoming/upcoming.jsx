import styles from "./upcoming.module.css";
import Image from "next/image";
import Link from "next/link";

const Upcoming = ({ appointments = [] }) => {
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'SCHEDULED')
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upcoming Appointments</h2>
        <Link href="/dashboard/Appointments" className={styles.viewAll}>
          View all →
        </Link>
      </div>

      {upcomingAppointments.length === 0 ? (
        <p className={styles.noData}>No upcoming appointments scheduled</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date & Time</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments.map((apt) => (
              <tr key={apt.id}>
                <td>
                  <div className={styles.doctor}>
                    <Image
                      src="/noavatar.png"
                      alt={apt.doctor.doctor_name}
                      width={38}
                      height={38}
                      className={styles.userImage}
                    />
                    <span className={styles.doctorName}>
                      Dr. {apt.doctor.doctor_name}
                    </span>
                  </div>
                </td>
                <td className={styles.type}>{apt.doctor.specialisation}</td>
                <td className={styles.date}>
                  {new Date(apt.appointmentTime).toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.status} ${styles.confirmed}`}>
                    {apt.mode.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Upcoming;