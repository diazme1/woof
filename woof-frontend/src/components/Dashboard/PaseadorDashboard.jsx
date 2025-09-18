import React, { useState } from "react";
import axios from "axios";
import styles from "./PaseadorDashboard.module.css";


const PaseadorDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [mostrarForm, setMostrarForm] = useState(false);
    const [fotoDni, setFotoDni] = useState(null);
    const [cv, setCv] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fotoDni || !cv) {
            setMensaje("Por favor, subí ambos archivos.");
            return;
        }

        const formData = new FormData();
        formData.append("fotoDni", fotoDni);
        formData.append("cv", cv);

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
            setMensaje(res.data);
        } catch (err) {
            console.error("Error al enviar archivos:", err);
            setMensaje("Hubo un problema al subir los archivos.");
        }
    };

    return (
        <main className={styles.dashboard}>
            <h1>Bienvenido {user?.nombre} 🐶</h1>
            <p>
                Ahora podés aceptar solicitudes de paseo ✨. <br />
                Esperamos que repartas tu amor a todos los perritos de tus paseos 🐾
            </p>

            {user?.rol === "ROLE_PASEADOR" && (
                <>
                    {!mostrarForm ? (
                        <button onClick={() => setMostrarForm(true)}>
                            Validarse
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.validacionForm}>
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
                </>
            )}

            {mensaje && <p>{mensaje}</p>}
        </main>
    );
};

export default PaseadorDashboard;