import { useEffect, useState } from "react";
import styles from "./Modal.module.scss";

function Modal({ children, visible }) {
	const [modalClass, setModalClass] = useState(
		visible ? styles.ModalShow : styles.ModalHide
	);

	const handleAnimation = (event) => {
		if (event.animationName === styles.fadeOut) {
			setModalClass(styles.ModalHide);
		}
	};

	// on modal toggle.
	useEffect(() => {
		setModalClass(visible ? styles.ModalShow : styles.ModalHiding);
	}, [visible]);

	return (
		<div
			className={styles.Modal + " " + modalClass}
			onAnimationEnd={handleAnimation}
		>
			{children}
		</div>
	);
}

export default Modal;
