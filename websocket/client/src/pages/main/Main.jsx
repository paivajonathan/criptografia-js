import styles from "./Main.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  /**
   * @param {Event} event 
   */
  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/chat/${username}`);
  }

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Cryptowhats</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          placeholder="Digite o nome que você deseja ao entrar"
          className={styles.usernameInput}
        />
        <input type="submit" value="Enviar" className={styles.submitButton} />
      </form>
    </div>
  );
}
