import styles from "./PopUp.module.css";
import { forwardRef, useEffect } from "react";

const PopUp = forwardRef(({ user, onClose }, ref) => {
  useEffect(() => {
    const dialog = ref.current;
    if (user && dialog) {
      if (!dialog.open) {
        dialog.showModal(); // Показывает с backdrop
      }
    } else if (dialog && dialog.open) {
      dialog.close();
    }
  }, [user, ref]);
  if (!user) return null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={styles.dialog_window}
      // Закрытие при клике на подложку (backdrop)
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={styles.modal_content}>
        <img src={user.image} alt="avatar" />
        <div className="user-info">
          <p>
            <strong>Имя:</strong> {user.firstName}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Телефон:</strong> {user.phone}
          </p>
          <p>
            <strong>Пол:</strong> {user.gender}
          </p>
          <p>
            <strong>Страна:</strong> {user.country}
          </p>
          <p>
            <strong>Город:</strong> {user.city}
          </p>
          <p>
            <strong>Адрес:</strong> {user.address}
          </p>
        </div>
      </div>
    </dialog>
  );
});

PopUp.displayName = "PopUp";

export default PopUp;
