import React from "react";
import styles from "./AdminDashboard.module.css";


const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <main className={styles.dashboard}>
            <h1>Bienvenido {user?.nombre} 🐶</h1>
        </main>
    );
};

export default AdminDashboard;
