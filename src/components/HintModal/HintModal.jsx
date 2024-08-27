import styles from "./HintModal.module.scss";

function HintModal({ children, hideFunc, hidden }) {
  return (
    <div className={styles.hint_blackout} onClick={hideFunc}>
      <div className={styles.hint_container}>{children}</div>
    </div>
  );
}

export default HintModal;
