import styles from "./LoadingScreen.module.scss";

function LoadingScreen(props) {
  return (
    <div className={styles.LoadingScreen}>
      <div className={styles["lds-heart"]}>
        <div></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
