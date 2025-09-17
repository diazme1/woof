import React from "react";
import styles from "./ClienteDashboard.module.css";


const ClienteDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <main className={styles.dashboard}>
            <h1>Bienvenido {user?.nombre} 🐶</h1>
            <p>
                Ahora podés generar solicitudes de paseo ✨. <br />
                Que la tranquilidad te acompañe en cada paseo 🐾
            </p>
        </main>
    );
};

export default ClienteDashboard;
