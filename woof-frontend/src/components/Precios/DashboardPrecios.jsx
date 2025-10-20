import { useState } from "react";
import styles from "./DashboardPrecios.module.css";
import axios from "axios";


const DashboardPrecios = () => {
    const [precio, setPrecio] = useState(0);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Payload que voy a enviar:", {
                precio: precio
            });

            const res = await axios.put("http://localhost:8080/user/actualizar-precio", precio, {
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            });
            alert("Precio actualizado correctamente");
        } catch (err) {
            setError("Hubo un error al actualizar el precio");
            console.error("Error al enviar datos:", err);
            alert("Hubo un problema al actualizar el precio. Intente nuevamente más tarde.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Actualizar precio</h2>

                <label>
                    Precio por paseo (en $ ARG)
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precio_nuevo"
                        value={precio}
                        onChange={(e) => setPrecio(parseFloat(e.target.value))}
                        required
                    />
                </label>

                <button type="submit">Actualizar precio</button>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
export default DashboardPrecios;

