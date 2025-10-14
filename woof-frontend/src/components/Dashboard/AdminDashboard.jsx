import React from "react";
import styles from "./Dashboard.module.css";
import DashboardValidaciones from "../Validaciones/DashboardValidaciones";

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <main className={styles.dashboard}>

            <section>
                <DashboardValidaciones />
            </section>
        </main>
    );
};

export default AdminDashboard;
