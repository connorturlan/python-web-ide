import { useEffect, useState } from "react";
import styles from "./Modal.module.scss";

function Modal({ children, visible }) {
  const [modalClass, setModalClass] = useState(
    visible ? styles.ModalShow : styles.ModalHide
  );

  // on modal toggle.
  useEffect(() => {
    setModalClass(visible ? styles.ModalShow : styles.ModalHide);
  }, [visible]);

  return <div className={styles.Modal + " " + modalClass}>{children}</div>;
}

export default Modal;
