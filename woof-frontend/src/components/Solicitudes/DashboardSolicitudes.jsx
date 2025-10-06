import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DashboardSolicitudes.module.css";

const DashboardSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const tamanosMap = {
        PEQUENO: "Pequeño",
        MEDIANO: "Mediano",
        GRANDE: "Grande"
    };

    const zonasMap = {
        QUILMES: "Quilmes",
        FLORENCIO_VARELA: "Florencio Varela",
        LA_PLATA: "La Plata",
        BERNAL: "Bernal",
        AVELLANEDA: "Avellaneda",
        DON_BOSCO: "Don Bosco"
    };

    const estadoMap = {
        PENDIENTE: "Pendiente",
        ACEPTADA: "Aceptada",
        CANCELADA: "Cancelada"
    };

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO);
        return f.toLocaleDateString("es-AR") + " " + f.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    const fetchSolicitudes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/paseo/cliente/${user?.id}`);
            setSolicitudes(response.data);
        } catch (err) {
            setError("Error al cargar las solicitudes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
        const interval = setInterval(fetchSolicitudes, 10000);
        return () => clearInterval(interval);
    }, []);

    const cancelarSolicitud = async (id) => {
        try {
            await axios.put(`http://localhost:8080/paseo/cancelar/${id}`);
            setSolicitudes(prev =>
                prev.map(s =>
                    s.solicitudId === id ? { ...s, estado: "CANCELADA" } : s
                )
            );
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al cancelar la solicitud:", err);
            alert("Hubo un error al cancelar la solicitud.");
        }
    };

    // 🔹 Función que determina si una solicitud es cancelable
    const esCancelable = (solicitud) => {
        if (solicitud.estado !== "PENDIENTE" && solicitud.estado !== "ACEPTADA") return false;

        const ahora = new Date();
        const horarioPaseo = new Date(solicitud.horario);
        return ahora < horarioPaseo; // Solo cancelable si aún no llegó la hora
    };

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>Mis solicitudes de paseo🐶</h2>

            {showSuccess && (
                <div className={styles.overlay} role="presentation" onClick={() => setShowSuccess(false)}>
                    <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <p>Solicitud cancelada con éxito 🐾</p>
                        <button type="button" onClick={() => setShowSuccess(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {solicitudes.length === 0 ? (
                <div className={styles.emptyMessageContainer}>
                    <div className={styles.emptyMessageBox}>
                        <p>No tienes solicitudes activas en este momento.</p>
                    </div>
                </div>
            ) : (
                <ul className={styles.lista}>
                    {solicitudes.map((s) => (
                        <li key={s.solicitudId} className={styles.item}>
                            <h3><strong>Zona:</strong> {zonasMap[s.zona] || s.zona}</h3>
                            <p><strong>Horario:</strong> {formatFecha(s.horario)}</p>
                            <p><strong>Perro:</strong> {s.nombrePerro} ({s.raza})</p>
                            <p><strong>Tamaño:</strong> {tamanosMap[s.tamanoPerro] || s.tamanoPerro}</p>
                            <p><strong>Estado:</strong> {estadoMap[s.estado] || s.estado}</p>

                            <div className={styles.cardActions}>
                                {esCancelable(s) && (
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={() => cancelarSolicitud(s.solicitudId)}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default DashboardSolicitudes;
