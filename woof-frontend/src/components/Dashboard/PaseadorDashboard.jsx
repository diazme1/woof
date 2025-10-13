import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Dashboard.module.css";

const PaseadorDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [mostrarForm, setMostrarForm] = useState(false);
    const [fotoDni, setFotoDni] = useState(null);
    const [cv, setCv] = useState(null);
    const [alias, setAlias] = useState(user?.alias || "");
    const [mensaje, setMensaje] = useState("");
    const [estadoValidacion, setEstadoValidacion] = useState("NO_ENVIADO");
    const [errores, setErrores] = useState({});




    // recuperar estado validación usuario
    useEffect(() => {
        if (!user?.id) return;
        axios
            .get(`http://localhost:8080/user/${user.id}`)
            .then((res) => {
                setEstadoValidacion(res.data.validado ?? "NO_ENVIADO");
                if (res.data.alias && !alias) setAlias(res.data.alias);
            })
            .catch(() => setEstadoValidacion("NO_ENVIADO"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const validarAlias = (valor) => {
        const errs = {};
        if (!valor || valor.trim() === "") {
            errs.alias = "El alias es obligatorio.";
        } else if (!/^[A-Za-z0-9_]{3,20}$/.test(valor)) {
            errs.alias =
                "Usá 3–20 caracteres, solo letras, números o _. Sin espacios.";
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = validarAlias(alias);
        setErrores(errs);
        if (Object.keys(errs).length > 0) {
            setMensaje("Revisá los errores del formulario.");
            return;
        }

        if (!fotoDni || !cv) {
            setMensaje("Por favor, subí ambos archivos.");
            return;
        }

        const formData = new FormData();
        formData.append("fotoDni", fotoDni);
        formData.append("cv", cv);
        formData.append("alias", alias);

        try {
            const res = await axios.post(
                `http://localhost:8080/user/${user.id}/validacion`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setMensaje(res.data || "Archivos enviados correctamente.");
            setEstadoValidacion("PENDIENTE");
            setMostrarForm(false);

            const updatedUser = {
                ...user,
                estadoValidacion: "PENDIENTE",
                alias, // ⬅️ guardamos el alias localmente también
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error("Error al enviar archivos:", err);
            const apiMsg =
                err?.response?.data?.message || "Hubo un problema al subir los archivos.";
            setMensaje(apiMsg);
        }
    };

    return (
        <main className={styles.dashboard}>
            <h1>Bienvenido/a {user?.nombre} 🐶</h1>
            <p>
                Ahora podés aceptar solicitudes de paseo ✨. <br />
                Esperamos que repartas tu amor a todos los perritos de tus paseos 🐾
            </p>

            {user?.rol === "ROLE_PASEADOR" && (
                <>
                    {estadoValidacion === "NO_ENVIADO" && !mostrarForm && (
                        <button onClick={() => setMostrarForm(true)}>Validarse</button>
                    )}

                    {mostrarForm && estadoValidacion === "NO_ENVIADO" && (
                        <form onSubmit={handleSubmit} className={styles.validacionForm}>
                            <label>
                                Alias (público):
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder="p.ej. paseos_mati"
                                    maxLength={20}
                                />
                            </label>
                            {errores.alias && (
                                <span className={styles.error}>{errores.alias}</span>
                            )}

                            <label>
                                Foto DNI:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFotoDni(e.target.files[0])}
                                />
                            </label>

                            <label>
                                CV (PDF):
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setCv(e.target.files[0])}
                                />
                            </label>

                            <button type="submit">Guardar archivos</button>
                        </form>
                    )}

                    {estadoValidacion === "PENDIENTE" && (
                        <div className={styles.alert}>
                            <p>📑 Tu solicitud de validación está pendiente de revisión.</p>
                            {alias && <p><strong>Alias:</strong> {alias}</p>}
                        </div>
                    )}

                    {estadoValidacion === "APROBADO" && (
                        <div className={styles.alertSuccess}>
                            <p>✅ Tu validación fue aprobada. Ya podés pasear perritos.</p>
                            {alias && <p><strong>Alias público:</strong> {alias}</p>}
                        </div>
                    )}
                </>
            )}

            {mensaje && <p>{mensaje}</p>}
        </main>
    );
};

export default PaseadorDashboard;
