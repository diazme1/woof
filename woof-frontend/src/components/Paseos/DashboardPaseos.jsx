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
    const [clienteInfo, setClienteInfo] = useState(null);
    const [loadingCliente, setLoadingCliente] = useState(false);

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
            setSolicitudes((prev) => prev.filter((s) => s.id !== id));
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al aceptar la solicitud:", err);
            alert("Hubo un error al aceptar la solicitud.");
        }
    };

    // NUEVO: handlers modal "Más info."
    const abrirDetalles = async (solicitud) => {
        setSolicitudSeleccionada(solicitud);
        setShowDetalles(true);
        setLoadingCliente(true);
        setClienteInfo(null);

        try {
            const response = await axios.get(`http://localhost:8080/user/${solicitud.idCliente}`);
            setClienteInfo(response.data);
        } catch (err) {
            console.error("Error al cargar información del cliente:", err);
            setClienteInfo(null);
        } finally {
            setLoadingCliente(false);
        }
    };
    const cerrarDetalles = () => {
        setShowDetalles(false);
        setSolicitudSeleccionada(null);
        setClienteInfo(null);
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
                        <li key={s.id} className={styles.item}>
                            <div className={styles.cardRow}>
                                <span className={styles.iconCircle} aria-hidden>
                                    {/* Icono reloj sencillo */}
                                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" strokeWidth="1.6"></circle>
                                        <path d="M12 7v5l3 2" strokeWidth="1.6"></path>
                                    </svg>
                                </span>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}><strong>Zona:</strong> {zonasMap[s.zona] || s.zona}</h3>
                                    <p className={styles.cardText}><strong>Horario:</strong> {formatFecha(s.horario)}</p>
                                    <p className={styles.cardText}><strong>Perro:</strong> {s.nombrePerro} ({s.raza})</p>
                                    <p className={styles.cardText}><strong>Tamaño:</strong> {tamanosMap[s.tamanoPerro] || s.tamanoPerro}</p>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                {/* Botón Más info. solo si hay detalles */}
                                {(
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
                                    onClick={() => aceptarSolicitud(s.id)}
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
                        style={{
                            maxWidth: '600px',
                            width: '90%',
                            backgroundColor: '#fff',
                            color: '#333',
                            border: '1px solid #ddd',
                            textAlign: 'left'
                        }}
                    >
                        <h3 style={{ color: '#007c7d', marginBottom: '16px', textAlign: 'center' }}>
                            Información completa del paseo
                        </h3>

                        <div style={{ marginBottom: '20px' }}>
                            {/* Información del Cliente */}
                            {loadingCliente ? (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f0f8ff',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    textAlign: 'center',
                                    color: '#007c7d'
                                }}>
                                    Cargando información del cliente...
                                </div>
                            ) : clienteInfo ? (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f0f8ff',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    border: '1px solid #b3d9ff'
                                }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#007c7d' }}>
                                        👤 Información del Cliente
                                    </h4>
                                    <p style={{ marginBottom: '6px' }}>
                                        <strong>Nombre:</strong> {clienteInfo.nombre}
                                    </p>
                                    <p style={{ marginBottom: '0' }}>
                                        <strong>Dirección:</strong> {clienteInfo.direccion}
                                    </p>
                                </div>
                            ) : (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#fff3cd',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    border: '1px solid #ffc107'
                                }}>
                                    <p style={{ margin: 0, color: '#856404' }}>
                                        No se pudo cargar la información del cliente
                                    </p>
                                </div>
                            )}

                            {/* Información del Paseo */}
                            <h4 style={{ margin: '0 0 10px 0', color: '#007c7d' }}>
                                🐕 Detalles del Paseo
                            </h4>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>Zona:</strong> {zonasMap[solicitudSeleccionada.zona] || solicitudSeleccionada.zona}
                            </p>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>Horario:</strong> {formatFecha(solicitudSeleccionada.horario)}
                            </p>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>Perro:</strong> {solicitudSeleccionada.nombrePerro}
                            </p>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>Raza:</strong> {solicitudSeleccionada.raza}
                            </p>
                            <p style={{ marginBottom: '10px' }}>
                                <strong>Tamaño:</strong> {tamanosMap[solicitudSeleccionada.tamanoPerro] || solicitudSeleccionada.tamanoPerro}
                            </p>

                            {solicitudSeleccionada.detalles && solicitudSeleccionada.detalles.trim().length > 0 && (
                                <>
                                    <p style={{ marginBottom: '8px', marginTop: '16px' }}>
                                        <strong>Detalles adicionales:</strong>
                                    </p>
                                    <div
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#f5f5f5",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd"
                                        }}
                                    >
                                        {solicitudSeleccionada.detalles}
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={cerrarDetalles}
                                style={{
                                    flex: '1',
                                    padding: '12px',
                                    backgroundColor: '#6c757d',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                            >
                                Cerrar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    aceptarSolicitud(solicitudSeleccionada.id);
                                    cerrarDetalles();
                                }}
                                style={{
                                    flex: '1',
                                    padding: '12px',
                                    backgroundColor: '#007c7d',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#006666'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#007c7d'}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default DashboardPaseos;
