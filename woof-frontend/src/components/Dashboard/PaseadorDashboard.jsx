import React from "react";
import styles from "./PaseadorDashboard.module.css";

const PaseadorDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <main className={styles.dashboard}>
            <h1>Bienvenido {user?.nombre} 🐶</h1>
            <p>
                Ahora podés aceptar solicitudes de paseo ✨. <br />
                Esperamos que repartas tu amor a todos los perritos de tus paseos 🐾
            </p>
        </main>
    );
};

export default PaseadorDashboard;
