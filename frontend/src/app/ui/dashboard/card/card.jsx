import styles from "./card.module.css";

const Card = ({ item }) => {
  if (!item) return null;

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div
          className={styles.icon}
          style={item.iconBg ? { background: item.iconBg } : undefined}
        >
          {item.icon}
        </div>
        {item.change && (
          <span
            className={`${styles.trend} ${
              item.change.isPositive ? styles.trendPositive : styles.trendNegative
            }`}
          >
            {item.change.value}
          </span>
        )}
      </div>

      <div className={styles.texts}>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.value}>{item.value}</span>
        {item.change && (
          <span className={styles.detail}>
            <span className={item.change.isPositive ? styles.positive : styles.negative}>
              {item.change.status}
            </span>
          </span>
        )}
        {!item.change && item.detailText && (
          <span className={styles.detail}>{item.detailText}</span>
        )}
      </div>
    </div>
  );
};

export default Card;