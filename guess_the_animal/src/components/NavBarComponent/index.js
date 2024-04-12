import styles from "./styles.module.scss";
import leao from "./leao.png";

export function NavBarComponent() {
    return(
        <div className={styles.nav}>
           BEM VINDO AO
           <img src={leao} className={styles.logo}/>
           ANIMALMENT
        </div>
    )
}