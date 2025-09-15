import React from "react";

const PaseadorDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
            <h1>Bienvenido {user?.name}</h1>
            <p>Rol: {user?.rol}</p>
            <p>Aquí iría la info de paseos, etc.</p>
        </div>
    );
};

export default PaseadorDashboard;
