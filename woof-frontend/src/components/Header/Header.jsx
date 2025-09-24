import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import PaseoForm from "../PaseoForm/PaseoForm";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPaseoForm, setShowPaseoForm] = useState(false);
    const token = localStorage.getItem("token");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

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

    const handleScroll = (sectionId) => {
        if (location.pathname !== "/") {
            // Si no estamos en la home, vamos primero a /
            navigate("/", { replace: false });
            // Esperamos que la página renderice
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }, 50);
        } else {
            // Si ya estamos en home, solo hacemos scroll
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: "smooth" });
        }
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
                    <li>
                        <button onClick={() => handleScroll("como-funciona")}>
                            Cómo funciona
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleScroll("por-que-elegirnos")}>
                            ¿Por qué elegirnos?
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleScroll("precios")}>
                            Precios
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleScroll("seguridad")}>
                            Seguridad
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleScroll("ayuda")}>
                            Ayuda
                        </button>
                    </li>
                </ul>

                <div className={styles.ctas}>
                    {isLoggedIn ? (
                        <>
                            {/* Solo paseador ve solicitudes activas */}
                            {JSON.parse(localStorage.getItem("user"))?.rol === "ROLE_PASEADOR" && (
                                <Link className={`${styles.btn} ${styles.ghost}`} to="/solicitudes">
                                    Solicitudes activas
                                </Link>
                            )}

                            {/* Solo cliente ve registrar solicitud */}
                            {JSON.parse(localStorage.getItem("user"))?.rol === "ROLE_CLIENTE" && (
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