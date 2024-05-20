import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Aguarde algum usuário se conectar</h1>
    </div>
  );
}