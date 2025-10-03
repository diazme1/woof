
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

    const finalizarPaseo = async (paseoId) => {
        console.log("ID del paseo a finalizar:", paseoId);
        try {
            await axios.put(`http://localhost:8080/paseo/finalizar/${paseoId}`);
            alert("Paseo finalizado con éxito!");

            // refrescar lista
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
                    {lista.map((s) => (
                        <li key={s.id} className={styles.item}>
                            <h3><strong>Fecha y Hora:</strong> {formatFecha(s.horario)}</h3>
                            <p><strong>Perro:</strong> {s.nombrePerro} ({s.raza})</p>
                            <p><strong>Estado:</strong> {s.estado}</p>

                            {/* Botón Finalizar paseo */}
                            {s.idPaseador === user.id
                                &&(
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


