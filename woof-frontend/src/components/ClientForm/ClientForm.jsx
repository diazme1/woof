import { useState } from "react";
import styles from "./ClientForm.module.css";

const ClientForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del cliente:", formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Formulario de Cliente</h2>

            <label>
                Nombre completo:
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </label>

            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>

            <label>
                Teléfono:
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>

            <label>
                Dirección:
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </label>

            <button type="submit">Guardar</button>
        </form>
    );
};

export default ClientForm;