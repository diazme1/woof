import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./DashboardSolicitudes.module.css";
import ReseniaForm from "../ReseniaForm/ReseniaForm";

const DashboardSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReseniaPopup, setShowReseniaPopup] = useState(false);
    const [solicitudParaResenia, setSolicitudParaResenia] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPagoPopup, setShowPagoPopup] = useState(false);
    const [aliasPaseador, setAliasPaseador] = useState("");
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [solicitudesConResenia, setSolicitudesConResenia] = useState([]);
    const [comprobanteEnviado, setComprobanteEnviado] = useState(false);
    const [paseadores, setPaseadores] = useState({});
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
        CANCELADA: "Cancelada",
        FINALIZADA: "Finalizada"
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

    useEffect(() => {
        axios.get(`http://localhost:8080/resenia/resenias-paseos`)
            .then((res) => {
                console.log("Ids con reseñas", res.data);
                setSolicitudesConResenia(res.data);
            })
            .catch(() => setSolicitudesConResenia([]));
    }, []);

    const cancelarSolicitud = async (id) => {
        try {
            await axios.put(`http://localhost:8080/paseo/solicitudes/${id}`);
            setSolicitudes(prev => prev.map(s =>
                s.id === id ? { ...s, estado: "CANCELADA" } : s
            ));
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

    const obtenerAliasPaseador = async (idPaseador) => {
        try {
            const response = await axios.get(`http://localhost:8080/user/${idPaseador}`);
            return response.data.alias || "Sin alias";
        } catch (err) {
            console.error("Error al obtener alias del paseador:", err);
            return "Sin alias";
        }
    };

    const obtenerNombrePaseador = (idPaseador) => {
        if (!paseadores[idPaseador]) return "Cargando...";
        const paseador = paseadores[idPaseador];
        return `${paseador.nombre}`;
    };

    useEffect(() => {
        const fetchPaseadoresInfo = async () => {
            const paseadoresData = {};
            for (const solicitud of solicitudes) {
                if (solicitud.idPaseador) {
                    try {
                        const response = await axios.get(`http://localhost:8080/user/${solicitud.idPaseador}`);
                        paseadoresData[solicitud.idPaseador] = response.data;
                    } catch (err) {
                        console.error(`Error al obtener datos del paseador ${solicitud.idPaseador}:`, err);
                    }
                }
            }
            setPaseadores(paseadoresData);
            console.log("Paseadores", paseadoresData);
        };

        if (solicitudes.length > 0) {
            fetchPaseadoresInfo();
        }
    }, [solicitudes]);

    const abrirPagoPopup = (solicitud) => {
        console.log(solicitud);
        setAliasPaseador(obtenerAliasPaseador(solicitud.idPaseador) || "Sin alias");
        setSolicitudSeleccionada(solicitud);
        setShowPagoPopup(true);
        setComprobanteEnviado(false);
    };

    const enviarComprobante = async (e) => {
        const file = e.target.files[0];
        if (!file || !solicitudSeleccionada) return;

        const formData = new FormData();
        formData.append("comprobante", file);

        try {
            await axios.post(`http://localhost:8080/paseo/${solicitudSeleccionada.id}/comprobante`,
                formData);
            setComprobanteEnviado(true);
        } catch (err) {
            console.error("Error al enviar comprobante:", err);
            alert("Error al subir el comprobante.");
        }
    };

    const poseeResenia = (idPaseo) => {
        return solicitudesConResenia.some(reseniaId => reseniaId === idPaseo);
    }

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.dashboardContainer}>
            <h2 className={styles.title}>Mis solicitudes de paseo🐶</h2>

            {showSuccess && (
                <div className={styles.overlay} onClick={() => setShowSuccess(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <p>Solicitud cancelada con éxito 🐾</p>
                        <button onClick={() => setShowSuccess(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {showPagoPopup && (
                <div className={styles.overlay} onClick={() => setShowPagoPopup(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {!comprobanteEnviado ? (
                            <>
                                <p><strong>Alias del paseador:</strong> {aliasPaseador}</p>
                                <input type="file" accept="image/*" onChange={enviarComprobante} />
                                <button onClick={() => setShowPagoPopup(false)}>Cerrar</button>
                            </>
                        ) : (
                            <>
                                <p>¡Comprobante de pago enviado con éxito! 🎉</p>
                                <button onClick={() => setShowPagoPopup(false)}>Cerrar</button>
                            </>
                        )}
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
                        <li key={s.id} className={styles.item}>
                            <h3><strong>Zona:</strong> {zonasMap[s.zona] || s.zona}</h3>
                            <p><strong>Horario:</strong> {formatFecha(s.horario)}</p>
                            <p><strong>Perro:</strong> {s.nombrePerro} ({s.raza})</p>
                            <p><strong>Tamaño:</strong> {tamanosMap[s.tamanoPerro] || s.tamanoPerro}</p>
                            {s.idPaseador && (
                                <p><strong>Paseador:</strong> <Link to={`/perfil`} className={styles.paseadorLink}>
                                    {obtenerNombrePaseador(s.idPaseador)}
                                </Link></p>
                            )}
                            <p><strong>Estado de solicitud:</strong> {estadoMap[s.estado] || s.estado}</p>
                            { (s.estadoPago === "PAGO") && (<p><strong>Estado de pago:</strong> {"Pagada ✅"}</p>)}
                            { (s.estadoPago === "PENDIENTE_DE_PAGO") && (<p><strong>Estado de pago:</strong> {"Pendiente"}</p>)}

                            <div className={styles.cardActions}>
                                {esCancelable(s) && (
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={() => cancelarSolicitud(s.solicitudId)}
                                    >
                                        Cancelar
                                    </button>
                                )}
                                {(s.estado === "ACEPTADA") && (s.estadoPago === "PENDIENTE_DE_PAGO") && (
                                    <button className={styles.btnPagar} onClick={() => abrirPagoPopup(s)}>
                                        Pagar
                                    </button>
                                )}

                                {s.estado === "FINALIZADA" && !poseeResenia(s.id) && (
                                    <button
                                        className={styles.finalizarBtn}
                                        onClick={() => {
                                            setSolicitudParaResenia(s);
                                            setShowReseniaPopup(true);
                                        }}
                                    >
                                        Opinar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showReseniaPopup && (
                <div className={styles.overlay} onClick={() => setShowReseniaPopup(false)}>
                    <div className={styles.modalResenia} onClick={(e) => e.stopPropagation()}>
                        <ReseniaForm
                            idPaseador={solicitudParaResenia.idPaseador}
                            idCliente={solicitudParaResenia.idCliente}
                            idPaseo={solicitudParaResenia.id}
                            onClose={() => setShowReseniaPopup(false)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default DashboardSolicitudes;
