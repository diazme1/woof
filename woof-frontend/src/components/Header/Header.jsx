import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>

                <button
                    className={styles.burger}
                    aria-label="Abrir menú"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div>
                    <Link to="/">
                        <img src="/logo.png" alt="Logo de la empresa" className={styles.logo} />
                    </Link>
                </div>

                <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                    <li><a href="#como-funciona">Cómo funciona</a></li>
                    <li><a href="#paseadores">Paseadores</a></li>
                    <li><a href="#precios">Precios</a></li>
                    <li><a href="#seguridad">Seguridad</a></li>
                    <li><a href="#ayuda">Ayuda</a></li>
                </ul>

                <div className={styles.ctas}>
                    <Link className={`${styles.btn} ${styles.ghost}`} to="/login">
                        Iniciar sesión
                    </Link>
                </div>
            </nav>

            <section className={styles.hero}>
                <h1>Paseos confiables cerca tuyo</h1>
                <p>Encontrá paseadores verificados con reseñas reales. Reservá en 2 minutos.</p>
                {/* Botones de buscar paseador y seguridad, Lo dejo comentado por ahora
                <div className={styles.heroActions}>
                    <a href="#paseadores" className={`${styles.btn} ${styles.solid}`}>
                        Buscar paseador
                    </a>
                    <a href="#seguridad" className={`${styles.btn} ${styles.linkBtn}`}>
                        Ver cómo garantizamos la seguridad
                    </a>
                </div>

                <p className={styles.trust}>
                    Perfiles verificados · Reseñas transparentes · Soporte 24/7
                </p>
                */}
            </section>
        </header>
    );
};

export default Header;