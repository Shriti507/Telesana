import styles from "./prescription.module.css";

const prescriptions = [
  {
    id: 1,
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "2x Daily",
    refills: "2 Left",
    status: "active",
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "1x Daily",
    refills: "Refill Now",
    status: "warning",
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "850mg",
    frequency: "With Meals",
    refills: "5 Left",
    status: "active",
  },
];

const Prescriptions = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Active Prescriptions</h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Refills</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((med) => (
            <tr key={med.id}>
              <td>
                <div className={styles.medicine}>
                  <span className={styles.medicineDot} />
                  {med.name}
                </div>
              </td>
              <td className={styles.text}>{med.dosage}</td>
              <td className={styles.text}>{med.frequency}</td>
              <td>
                <span className={`${styles.badge} ${styles[med.status]}`}>
                  {med.refills}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Prescriptions;