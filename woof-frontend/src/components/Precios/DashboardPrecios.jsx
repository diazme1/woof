import {useEffect, useState} from "react";
import styles from "./DashboardPrecios.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const DashboardPrecios = () => {
    const [precio, setPrecio] = useState();
    const [precioViejo, setPrecioViejo] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatearPrecio = (valor) => {
        if (valor === null || valor === undefined || isNaN(valor)) return "0,00";
        return valor.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    //recuperar precios actuales
    useEffect(() => {
        axios
            .get(`http://localhost:8080/paseo/precio`)
            .then((res) => {
                setPrecioViejo(res.data);
            })
            .catch(() => setPrecioViejo(0));
        console.log("Precio actual recuperado:", precioViejo);
    }, []);

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
            alert("Precio modificado exitosamente");
            navigate("/validaciones")
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

                <pt><strong>Precio actual: $ {formatearPrecio(precioViejo)}</strong></pt>

                <label>
                    Precio por paseo (en $ ARG)
                    <input
                        type="number"
                        step="0.01"
                        min="1"
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

