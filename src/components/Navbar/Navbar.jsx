import styles from "./Navbar.module.scss";

function Navbar({ children, classes }) {
  return <div className={styles.Navbar + " " + classes}>{children}</div>;
}

export default Navbar;
