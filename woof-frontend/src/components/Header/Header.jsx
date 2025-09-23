import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import PaseoForm from "../PaseoForm/PaseoForm";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPaseoForm, setShowPaseoForm] = useState(false);
    const token = localStorage.getItem("token");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    const handleScroll = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/", { replace: false });
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }, 50);
        } else {
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

                {/* Si NO es paseador, mostramos las secciones del landing */}
                {user?.rol == null && (
                    <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                        <li><button onClick={() => handleScroll("como-funciona")}>Cómo funciona</button></li>
                        <li><button onClick={() => handleScroll("paseadores")}>Paseadores</button></li>
                        <li><button onClick={() => handleScroll("precios")}>Precios</button></li>
                        <li><button onClick={() => handleScroll("seguridad")}>Seguridad</button></li>
                        <li><button onClick={() => handleScroll("ayuda")}>Ayuda</button></li>
                    </ul>
                )}

                <div className={styles.ctas}>
                    {isLoggedIn ? (
                        <>
                            {user?.rol === "ROLE_PASEADOR" && (
                                <>
                                    <Link className={styles.profileIcon} to="/perfil">
                                        <FaUserCircle size={32} />
                                    </Link>
                                    <Link className={`${styles.btn} ${styles.ghost}`} to="/solicitudes">
                                        Solicitudes activas
                                    </Link>
                                </>
                            )}

                            {user?.rol === "ROLE_CLIENTE" && (
                                <button onClick={() => setShowPaseoForm(true)}>
                                    Registrar solicitud
                                </button>
                            )}

                            <button className={styles.btn} onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link className={`${styles.btn} ${styles.ghost}`} to="/login">
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </nav>

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
            </section>
        </header>
    );
};

export default Header;
