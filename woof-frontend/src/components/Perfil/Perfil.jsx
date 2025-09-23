import { useEffect, useState } from "react";
import styles from "./Perfil.module.css";

const Perfil = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    if (!user) {
        return <p style={{ padding: "2rem" }}>Cargando perfil...</p>;
    }

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
            {user.paseosRealizados ?? 0}
          </span>
                    <span>Paseos realizados</span>
                </div>
                <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {user.antiguedad || "0 meses"}
          </span>
                    <span>Antigüedad</span>
                </div>
            </section>
        </div>
    );
};

export default Perfil;
