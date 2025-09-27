import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DashboardPaseosAceptados.module.css";

const DashboardPaseosAceptados = () => {
    const [paseosActivos, setPaseosActivos] = useState([]);
    const [paseosHistoricos, setPaseosHistoricos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("activos"); // activos | historicos
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO);
        return f.toLocaleDateString("es-AR") + " " + f.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
        });
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

    if (loading) return <p>Cargando paseos...</p>;
    if (error) return <p>{error}</p>;

    const lista = view === "activos" ? paseosActivos : paseosHistoricos;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>Mis Paseos Aceptados</h2>

            {/* Selector de tabs */}
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

            {/* Lista de paseos */}
            {lista.length === 0 ? (
                <div className={styles.emptyMessageContainer}>
                    <div className={styles.emptyMessageBox}>
                        <p>No hay paseos {view}.</p>
                    </div>
                </div>
            ) : (
                <ul className={styles.lista}>
                    {lista.map((p) => (
                        <li key={p.id} className={styles.item}>
                            <h3><strong>Fecha y Hora:</strong> {formatFecha(p.horario)}</h3>
                            <p><strong>Perro:</strong> {p.nombrePerro} ({p.raza})</p>
                            <p><strong>Estado:</strong> {p.estado}</p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};
// <p><strong>Cliente:</strong> {p.nombreCliente}</p>
//<p><strong>Precio:</strong> ${p.precio}</p>
export default DashboardPaseosAceptados;

