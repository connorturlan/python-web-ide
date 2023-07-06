import styles from "./Panel.module.scss";

function Panel({ children, className }) {
  return <div className={styles.Panel + " " + className}>{children}</div>;
}

export default Panel;
