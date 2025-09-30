// DashboardPaseos.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DashboardPaseos.module.css";

const DashboardPaseos = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // NUEVO: estado para modal "Más info."
    const [showDetalles, setShowDetalles] = useState(false);
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    const usuario = JSON.parse(localStorage.getItem("user"));
    const idPaseador = usuario?.id;

    const tamanosMap = {
        PEQUENO: "Pequeño",
        GRANDE: "Grande",
        MEDIANO: "Mediano",
    };
    const zonasMap = {
        QUILMES: "Quilmes",
        FLORENCIO_VARELA: "Florencio Varela",
        LA_PLATA: "La Plata",
        BERNAL: "Bernal",
        AVELLANEDA: "Avellaneda",
        DON_BOSCO: "Don Bosco",
    };

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO);
        return (
            f.toLocaleDateString("en-GB") +
            " " +
            f.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        );
    };

    useEffect(() => {
        let isMounted = true;
        const fetchSolicitudes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/paseo/solicitudes");
                if (isMounted) setSolicitudes(response.data);
            } catch (err) {
                if (isMounted) setError("Error al cargar las solicitudes.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSolicitudes();

        const interval = setInterval(() => {
            fetchSolicitudes();
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const aceptarSolicitud = async (id) => {
        try {
            await axios.put(`http://localhost:8080/paseo/${id}/paseador/${idPaseador}`);
            setSolicitudes((prev) => prev.filter((s) => s.solicitudId !== id));
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al aceptar la solicitud:", err);
            alert("Hubo un error al aceptar la solicitud.");
        }
    };

    // NUEVO: handlers modal "Más info."
    const abrirDetalles = (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setShowDetalles(true);
    };
    const cerrarDetalles = () => {
        setShowDetalles(false);
        setSolicitudSeleccionada(null);
    };

    // NUEVO: cerrar modal con Escape
    useEffect(() => {
        if (!showDetalles) return;
        const onKey = (e) => e.key === "Escape" && cerrarDetalles();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showDetalles]);

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>🐾 Solicitudes de Paseos disponibles 🐾</h2>

            {/* Modal de éxito existente */}
            {showSuccess && (
                <div
                    className={styles.overlay}
                    role="presentation"
                    onClick={() => {
                        setShowSuccess(false);
                        navigate("/solicitudes");
                    }}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>Solicitud aceptada con éxito 🐾</p>
                        <button
                            type="button"
                            onClick={() => {
                                setShowSuccess(false);
                                navigate("/solicitudes");
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {solicitudes.length === 0 ? (
                <div className={styles.emptyMessageContainer}>
                    <div className={styles.emptyMessageBox}>
                        <p>No hay solicitudes disponibles en este momento.</p>
                    </div>
                </div>
            ) : (
                <ul className={styles.lista}>
                    {solicitudes.map((s) => (
                        <li key={s.solicitudId} className={styles.item}>
                            <h3>
                                <strong>Zona:</strong> {zonasMap[s.zona] || s.zona}
                            </h3>
                            <p>
                                <strong>Horario:</strong> {formatFecha(s.horario)}
                            </p>
                            <p>
                                <strong>Perro:</strong> {s.nombrePerro} ({s.raza})
                            </p>
                            <p>
                                <strong>Tamaño:</strong> {tamanosMap[s.tamanoPerro] || s.tamanoPerro}
                            </p>

                            <div className={styles.cardActions}>
                                {/* NUEVO: Botón Más info. solo si hay detalles */}
                                {s.detalles && s.detalles.trim().length > 0 && (
                                    <button
                                        className={styles.btnSecondary || styles.btnPrimary}
                                        type="button"
                                        onClick={() => abrirDetalles(s)}
                                        title="Ver detalles del paseo"
                                    >
                                        Más info.
                                    </button>
                                )}

                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => aceptarSolicitud(s.solicitudId)}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* NUEVO: Modal con Detalles */}
            {showDetalles && solicitudSeleccionada && (
                <div
                    className={styles.overlay}
                    role="presentation"
                    onClick={cerrarDetalles}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Detalles del paseo</h3>
                        <div
                            style={{
                                whiteSpace: "pre-wrap",
                                maxHeight: "45vh",
                                overflowY: "auto",
                                marginBottom: 16,
                            }}
                        >
                            {solicitudSeleccionada.detalles}
                        </div>
                        <button type="button" onClick={cerrarDetalles}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default DashboardPaseos;
