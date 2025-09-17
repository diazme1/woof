import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import PaseoForm from "../PaseoForm/PaseoForm";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPaseoForm, setShowPaseoForm] = useState(false);
    const token = localStorage.getItem("token");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        window.location.href = "/"; // o navigate("/") si usás react-router
    };

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
                    {isLoggedIn ? (
                        <>
                            {/* Solo paseador ve solicitudes activas */}
                            {JSON.parse(localStorage.getItem("user"))?.rol === "PASEADOR" && (
                                <Link className={`${styles.btn} ${styles.ghost}`} to="/solicitudes">
                                    Solicitudes activas
                                </Link>
                            )}

                            {/* Solo cliente ve registrar solicitud */}
                            {JSON.parse(localStorage.getItem("user"))?.rol === "CLIENTE" && (
                                <button onClick={() => setShowPaseoForm(true)}>
                                    Registrar solicitud
                                </button>
                            )}

                            <button className={styles.btn} onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className={`${styles.btn} ${styles.ghost}`} to="/login">
                                Iniciar sesión
                            </Link>
                        </>
                    )}


                </div>

            </nav>

            {/* Modal de solicitud de paseo */}
            {showPaseoForm && (
                <div
                    className={styles.backdrop}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="paseo-title"
                    onClick={() => setShowPaseoForm(false)}
                >
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 id="paseo-title">Registrar solicitud de paseo</h3>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowPaseoForm(false)}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <PaseoForm />
                        </div>
                    </div>
                </div>
            )}

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