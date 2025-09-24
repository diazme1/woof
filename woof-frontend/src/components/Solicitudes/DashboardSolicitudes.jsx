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
        ACEPTADA: "Aceptada"
    };

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO);
        return f.toLocaleDateString("en-GB") + " " + f.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    // Traer solicitudes del cliente
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

        const interval = setInterval(fetchSolicitudes, 10000); // refresco cada 10s
        return () => clearInterval(interval);
    }, []);

    // Cancelar solicitud
    const cancelarSolicitud = async (id) => {
        try {
            await axios.put(`http://localhost:8080/solicitudes/${id}/cancelar`);
            setSolicitudes(prev => prev.map(s =>
                s.solicitudId === id ? { ...s, estado: "CANCELADA" } : s
            ));
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al cancelar la solicitud:", err);
            alert("Hubo un error al cancelar la solicitud.");
        }
    };

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>🐾 Mis Solicitudes de Paseo 🐾</h2>

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
                                {(s.estado === "PENDIENTE" || s.estado === "ACEPTADA") && (
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

