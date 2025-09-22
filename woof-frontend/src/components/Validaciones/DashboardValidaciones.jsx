// DashboardValidaciones.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DashboardValidaciones.module.css";

const DashboardValidaciones = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/user/validaciones/pendientes",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (isMounted) setUsuarios(response.data);
            } catch (err) {
                if (isMounted) setError("Error al cargar validaciones pendientes.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };


        fetchUsuarios();

        const interval = setInterval(() => {
            fetchUsuarios();
        }, 100000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const aprobarValidacion = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/user/${id}/aprobar-validacion`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setUsuarios((prev) => prev.filter((u) => u.idPaseador !== id));
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al aprobar validación:", err);
            alert("Hubo un error al aprobar la validación.");
        }
    };

    const rechazarValidacion = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/user/${id}/rechazar-validacion`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setUsuarios((prev) => prev.filter((u) => u.idPaseador !== id));
            setShowSuccess(true);
        } catch (err) {
            console.error("Error al rechazar validación:", err);
            alert("Hubo un error al rechazar la validación.");
        }
    };


    if (loading) return <p>Cargando validaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>📑 Validaciones pendientes de paseadores</h2>

            {/* Mensaje de éxito */}
            {showSuccess && (
                <div
                    className={styles.overlay}
                    role="presentation"
                    onClick={() => {
                        setShowSuccess(false);
                        navigate("/admin/validaciones");
                    }}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>Validación aprobada con éxito ✅</p>
                        <button
                            type="button"
                            onClick={() => {
                                setShowSuccess(false);
                                navigate("/admin/validaciones");
                            }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {usuarios.length === 0 ? (
                <div className={styles.emptyMessageContainer}>
                    <div className={styles.emptyMessageBox}>
                        <p>No hay validaciones pendientes en este momento.</p>
                    </div>
                </div>
            ) : (
                <ul className={styles.lista}>
                    {usuarios.map((u) => (
                        <li key={u.idPaseador} className={styles.item}>
                            <h3><strong>Nombre:</strong> {u.nombre}</h3>
                            <p><strong>Email:</strong> {u.email}</p>
                            <p><strong>DNI:</strong> {u.dni}</p>
                            <p><strong>Teléfono:</strong> {u.telefono}</p>
                            <p><strong>Estado:</strong> {u.estadoValidacion}</p> {/* 👈 Nuevo */}

                            <div className={styles.cardActions}>
                                {u.fotoDni && (
                                    <a href={`http://localhost:8080/user/${u.idPaseador}/foto-dni`} target="_blank" rel="noreferrer">
                                        📎 Ver DNI
                                    </a>
                                )}
                                {u.cv && (

                                    <a href={`http://localhost:8080/user/${u.idPaseador}/cv`} target="_blank" rel="noreferrer">
                                        📎 Ver CV
                                    </a>
                                )}
                                <p><strong>Estado:</strong> {u.validado}</p>

                                {u.validado === "PENDIENTE" && (
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={() => aprobarValidacion(u.idPaseador)}
                                    >
                                        Aprobar
                                    </button>
                                )}

                                {u.validado === "PENDIENTE" && (
                                    <button
                                        className={styles.btnRechazar}
                                        onClick={() => rechazarValidacion(u.idPaseador)}
                                    >
                                        Rechazar
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

export default DashboardValidaciones;
