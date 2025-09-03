import React from "react";
import styles from "./Body.module.css";

const Body = () => {
    return (
        <div>
            <main className={styles.fadeIn} style={{
                maxWidth: "800px",
                margin: "50px auto",
                padding: "0 20px",
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.6,
                color: "#333"
            }}>
                <p>
                    Somos un equipo de amantes de los animales que entendemos lo importante que es cada paseo para tu perro.
                    Por eso creamos Woof! Una app en la que los dueños ocupados pueden encontrar paseadores confiables cerca de su zona, con perfiles verificados y reseñas reales.
                </p>
                <p>¿Nuestro objetivo? Comodidad para el dueño y felicidad para la mascota</p>
            </main>
        </div>
    );
};

export default Body;
