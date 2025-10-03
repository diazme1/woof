import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DashboardPaseosAceptados.module.css";

const DashboardPaseosAceptados = () => {
    const [paseosActivos, setPaseosActivos] = useState([]);
    const [paseosHistoricos, setPaseosHistoricos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("activos");
    const [error, setError] = useState(null);
    const [showFinalizadoPopup, setShowFinalizadoPopup] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO);
        return f.toLocaleDateString("es-AR") + " " + f.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const finalizarPaseo = async (paseoId) => {
        try {
            await axios.put(`http://localhost:8080/paseo/finalizar/${paseoId}`);
            setShowFinalizadoPopup(true);

            const resActivos = await axios.get(`http://localhost:8080/paseo/paseador/actuales/${user.id}`);
            setPaseosActivos(resActivos.data);

            const resHistoricos = await axios.get(`http://localhost:8080/paseo/paseador/historicos/${user.id}`);
            setPaseosHistoricos(resHistoricos.data);
        } catch (err) {
            console.error("Error al finalizar paseo:", err);
            alert(err.response?.data?.message || "Error al finalizar el paseo");
        }
    };

    useEffect(() => {
        const fetchPaseos = async () => {
            try {
                const [resActivos, resHistoricos] = await Promise.all([
                    axios.get(`http://localhost:8080/paseo/paseador/actuales/${user.id}`),
                    axios.get(`http://localhost:8080/paseo/paseador/historicos/${user.id}`)
                ]);

                setPaseosActivos(resActivos.data);
                setPaseosHistoricos(resHistoricos.data);
            } catch (err) {
                console.error("Error al cargar paseos:", err);
                setError("Error al cargar los paseos aceptados.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaseos();
    }, [user.id]);

    const lista = view === "activos" ? paseosActivos : paseosHistoricos;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>Mis Paseos Aceptados</h2>

            {/* Popup de finalización */}
            {showFinalizadoPopup && (
                <div className={styles.overlay} onClick={() => setShowFinalizadoPopup(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <p>¡Paseo finalizado con éxito! 🐾</p>
                        <button onClick={() => setShowFinalizadoPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${view === "activos" ? styles.activeTab : ""}`}
                    onClick={() => setView("activos")}
                >
                    Activos
                </button>
                <button
                    className={`${styles.tabBtn} ${view === "historicos" ? styles.activeTab : ""}`}
                    onClick={() => setView("historicos")}
                >
                    Históricos
                </button>
            </div>

            {/* Lista */}
            {lista.length === 0 ? (
                <div className={styles.emptyMessageContainer}>
                    <div className={styles.emptyMessageBox}>
                        <p>No hay paseos {view}.</p>
                    </div>
                </div>
            ) : (
                <ul className={styles.lista}>
                    {lista.map((s) => (
                        <li key={s.id} className={styles.item}>
                            <h3><strong>Fecha y Hora:</strong> {formatFecha(s.horario)}</h3>
                            <p><strong>Perro:</strong> {s.nombrePerro} ({s.raza})</p>
                            <p><strong>Estado de solicitud:</strong> {s.estado}</p>
                            { (s.estadoPago === "PAGO") && (<p><strong>Estado de pago:</strong> {"Pagada"}</p>)}
                            { (s.estadoPago === "PENDIENTE_DE_PAGO") && (<p><strong>Estado de pago:</strong> {"Pendiente"}</p>)}


                            {s.idPaseador === user.id && (
                                <button
                                    className={styles.finalizarBtn}
                                    onClick={() => finalizarPaseo(s.id)}
                                >
                                    Finalizar paseo
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default DashboardPaseosAceptados;
