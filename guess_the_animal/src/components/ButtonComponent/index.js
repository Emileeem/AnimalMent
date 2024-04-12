import styles from "./styles.module.scss";

export function ButtonComponent() {
    return(
        <div className={styles.nav}>
          <button className={styles.button}>
            Começar a desenhar!
          </button>
        </div>
    )
}