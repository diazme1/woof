import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import PaseoForm from "../PaseoForm/PaseoForm";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showPaseoForm, setShowPaseoForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userI, setUserI] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // url creada con createObjectURL para el avatar
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [photoOk, setPhotoOk] = useState(false);

    // Carga inicial desde localStorage + sync por storage events
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserStr = localStorage.getItem("user");
        const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

        setIsLoggedIn(!!token);
        if (storedUser) setUser(storedUser);

        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem("token");
            const updatedUserStr = localStorage.getItem("user");
            const updatedUser = updatedUserStr ? JSON.parse(updatedUserStr) : null;
            setIsLoggedIn(!!updatedToken);
            setUser(updatedUser);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
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
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 50);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    const userId = user?.id ?? user?.idPaseador;

    // --- FETCH de la foto desde el endpoint como BLOB ---
    const fetchAvatar = async (id) => {
        // limpiar URL anterior para evitar fugas
        setPhotoOk(false);
        if (avatarUrl) {
            URL.revokeObjectURL(avatarUrl);
            setAvatarUrl(null);
        }
        if (!id) return;

        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8080/user/${id}/foto-perfil?t=${Date.now()}`; // cache-buster

            const { data, headers } = await axios.get(url, {
                responseType: "blob",
                // si tu backend no requiere auth, eliminá este header:
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                // con credentials si tu backend usa cookie/sesión (si no, podés quitarlo)
                withCredentials: false,
            });

            // validar que realmente sea imagen
            const ct = headers["content-type"] || "";
            if (!ct.startsWith("image") || !data || data.size === 0) {
                setPhotoOk(false);
                return;
            }

            const objUrl = URL.createObjectURL(data);
            setAvatarUrl(objUrl);
            setPhotoOk(true);
        } catch {
            setPhotoOk(false);
        }
    };

    // 1) traer foto cuando haya userId
    useEffect(() => {
        if (!userId) {
            setPhotoOk(false);
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
                setAvatarUrl(null);
            }
            return;
        }
        fetchAvatar(userId);

        // cleanup al desmontar o cambiar userId
        return () => {
            if (avatarUrl) {
                URL.revokeObjectURL(avatarUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // 2) live-update: si Perfil dispara "user-updated", refrescamos y re-fetch avatar
    useEffect(() => {
        const onUserUpdated = (e) => {
            const next = e?.detail?.user;
            if (next) {
                setUser(next);
                const updatedToken = localStorage.getItem("token");
                setIsLoggedIn(!!updatedToken);
                if (next.id || next.idPaseador) {
                    fetchAvatar(next.id ?? next.idPaseador);
                }
            }
        };
        window.addEventListener("user-updated", onUserUpdated);
        return () => window.removeEventListener("user-updated", onUserUpdated);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onAvatarChanged = (e) => {
            // si mandaste userId en el detail, lo usás; si no, usá el del estado
            const changedId = e?.detail?.userId ?? (user?.id ?? user?.idPaseador);
            if (changedId) fetchAvatar(changedId);
        };
        window.addEventListener("avatar-changed", onAvatarChanged);
        return () => window.removeEventListener("avatar-changed", onAvatarChanged);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, user?.idPaseador]);

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8080/user/${userId}`).then(({ data }) => {
            console.log("DATOS", data)
            setUserI(data);
        });
    }, [userId]);


    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                {/* Burger */}
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

                {/* Logo */}
                <div>
                    <Link to="/">
                        <img src="/logo.png" alt="Logo de la empresa" className={styles.logo} />
                    </Link>
                </div>

                {/* Links del landing si no eligió rol aún */}
                {user?.rol == null && (
                    <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                        <li><button onClick={() => handleScroll("como-funciona")}>Cómo funciona</button></li>
                        <li><button onClick={() => handleScroll("por-que-elegirnos")}>¿Por qué elegirnos?</button></li>
                        <li><button onClick={() => handleScroll("precios")}>Precios</button></li>
                        <li><button onClick={() => handleScroll("seguridad")}>Seguridad</button></li>
                    </ul>
                )}

                {/* CTAs */}
                <div className={styles.ctas}>
                    {isLoggedIn ? (
                        <>
                            {user?.rol === "ROLE_PASEADOR" && (
                                <>
                                    <Link className={styles.profileIcon} to="/perfil" title="Mi perfil">
                                        {photoOk && avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Foto de perfil"
                                                className={styles.avatarHeader}
                                                onError={() => setPhotoOk(false)}
                                            />
                                        ) : (
                                            <FaUserCircle className={styles.avatarHeaderFallback} />
                                        )}
                                    </Link>


                                    {userI?.validado === "APROBADO" && (
                                        <Link className={`${styles.btn} ${styles.ghost}`} to="/solicitudes">
                                            Solicitudes activas
                                        </Link>
                                    )}


                                    <Link className={`${styles.btn} ${styles.ghost}`} to="/paseos-aceptados">
                                        Paseos aceptados
                                    </Link>
                                </>
                            )}

                            {user?.rol === "ROLE_CLIENTE" && (
                                <>
                                    <Link className={`${styles.btn} ${styles.ghost}`} to="/mis-solicitudes">
                                        Mis solicitudes
                                    </Link>
                                    <button onClick={() => setShowPaseoForm(true)}>
                                        Registrar solicitud
                                    </button>
                                </>
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

            {/* Modal Registrar Paseo */}
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

            {/* Hero */}
            <section className={styles.hero}>
                {!isLoggedIn ? (
                    <>
                        <h1>Paseos confiables cerca tuyo</h1>
                        <p>Encontrá paseadores verificados con reseñas reales. Reservá en 2 minutos.</p>
                    </>
                ) : (
                    <>
                        <h1>
                            Bienvenido/a {user?.nombre || "usuario"} 🐶 🐾
                        </h1>
                        <p>Nos alegra tenerte de vuelta 🐾</p>
                    </>
                )}
            </section>
        </header>
    );
};

export default Header;
