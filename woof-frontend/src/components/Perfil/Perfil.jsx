import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";
import axios from "axios";

const Perfil = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [paseos,setPaseos] = useState(0);
    const [antiguedad, setAntiguedad] = useState("0 meses");
    console.log("Usuario en localStorage:", user)

    useEffect(() => {
        if (!user?.id) return;
        axios.get(`http://localhost:8080/paseos/solicitudes/${user.id}`)
    .then((res) => {
            setPaseos(res.data);
        })
            .catch((err) => {
                console.error("Error al obtener paseos:", err);
                setPaseos(0);
            });
    }, [user?.id]);


    useEffect(() => {
        if (!user?.id) return;
        axios.get(`http://localhost:8080/usuarios/${user.id}/antiguedad`)
            .then((res) => setAntiguedad(`${res.data} meses`))
            .catch(() => setAntiguedad("0 meses"));
    }, [user?.id]);

    return (
        <div className={styles.perfil}>
            <h1>Mi Perfil</h1>

            {/* Foto + nombre */}
            <div className={styles.header}>
                <img
                    src={user.foto || "/default-avatar.png"}
                    alt="Foto de perfil"
                    className={styles.avatar}
                />
                <h2>{user.nombre || "Nombre no disponible"}</h2>
            </div>

            {/* Datos de contacto */}
            <section className={styles.info}>
                <h3>Datos de contacto</h3>
                <p><strong>Teléfono:</strong> {user.telefono || "No disponible"}</p>
                <p><strong>Email:</strong> {user.email || "No disponible"}</p>
            </section>

            {/* Biografía */}
            <section className={styles.bio}>
                <h3>Sobre mí</h3>
                <p>{user.biografia || "Este usuario aún no agregó una biografía."}</p>
            </section>

            {/* Estadísticas */}
            <section className={styles.stats}>
                <h3>Estadísticas</h3>
                <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {paseos}
          </span>
                    <span>Paseos realizados</span>
                </div>
                <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {antiguedad}
          </span>
                    <span>Antigüedad</span>
                </div>
            </section>
        </div>
    );
};

export default Perfil;
