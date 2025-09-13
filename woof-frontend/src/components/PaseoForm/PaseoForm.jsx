// PaseoForm.jsx
import { useState, useEffect } from "react";
import styles from "./PaseoForm.module.css";
import axios from 'axios';

const initial = { zona:"", horario:"", nombrePerro:"", tamanoPerro:"", raza:""};

const validate = (v) => {
    const errors = {};
    if (!v.nombrePerro.trim()) errors.nombrePerro = "Ingresá el nombre de tu perro.";
    if (!v.raza.trim()) errors.raza = "Ingresá la raza de tu perro.";
    if (!v.zona) {
        errors.zona = "Seleccioná una zona.";
    } else if (!["QUILMES", "BERNAL", "DON_BOSCO", "FLORENCIO_VARELA", "AVELLANEDA", "LA_PLATA"].includes(v.zona)) {
        errors.zona = "Zona inválido.";
    }
    return errors;
};

export default function PaseoForm() {
    const [formData, setFormData] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = {
            ...formData,
            [name]: name === "phone" ? value.replace(/\D/g, "") : value,
        };
        setFormData(next);
        if (touched[name]) setErrors(validate(next));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors(validate(formData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextErrors = validate(formData);
        setErrors(nextErrors);
        setTouched({ zona: true, horario:true, nombrePerro: true, tamanoPerro: true, raza: true});
        if (Object.keys(nextErrors).length) return;

        //mostrar pop up
        try {
            const today = new Date().toISOString().split("T")[0];
            const horarioCompleto = `${today}T${formData.horario}:00`;
            // datos al back
            const response = await axios.post("http://localhost:8080/paseo", {
                zona: formData.zona,
                horario: horarioCompleto,
                nombrePerro: formData.nombrePerro,
                tamanoPerro: formData.tamanoPerro,
                raza: formData.raza
            });

            console.log("Respuesta del backend:", response.data);

            // success y reset
            setFormData(initial);
            setTouched({});
            setErrors({});
            setShowSuccess(true);
        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Hubo un problema al generar la solicitud de paseo. Intenta nuevamente.");
        }
    };


    useEffect(() => {
        if (!showSuccess) return;
        const onKey = (ev) => ev.key === "Escape" && setShowSuccess(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showSuccess]);

    const fieldError = (name) => touched[name] && errors[name];

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <h2>Formulario de solicitud de paseo</h2>

                <label>
                    Zona de paseo:
                    <select
                        name="zona"
                        value={formData.zona}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("zona")}
                        required
                    >
                        <option value="" disabled>Seleccioná una opción</option>
                        <option value="QUILMES">Quilmes</option>
                        <option value="BERNAL">Bernal</option>
                        <option value="DON_BOSCO">Don Bosco</option>
                        <option value="FLORENCIO_VARELA">Florencio Varela</option>
                        <option value="LA_PLATA">La Plata</option>
                    </select>
                    {fieldError("zona") && (
                        <small className={styles.error}>{errors.zona}</small>
                    )}
                </label>

                <label>
                    Horario de paseo:
                    <input
                        type="time"
                        name="horario"
                        value={formData.horario}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("horario")}
                    />
                    {fieldError("horario") && (
                        <small className={styles.error}>{errors.horario}</small>
                    )}
                </label>

                <label>
                    Nombre de tu perro:
                    <input
                        type="text"
                        name="nombrePerro"
                        value={formData.nombrePerro}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("nombrePerro")}
                    />
                    {fieldError("nombrePerro") && (
                        <small className={styles.error}>{errors.nombrePerro}</small>
                    )}
                </label>

                <label>
                    Tamaño de tu perro:
                    <select
                        name="tamanoPerro"
                        value={formData.tamanoPerro}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("tamanoPerro")}
                        required
                    >
                        <option value="" disabled>Seleccioná una opción</option>
                        <option value="PEQUENO">Pequeño</option>
                        <option value="MEDIANO">Mediano</option>
                        <option value="GRANDE">Grande</option>
                    </select>
                    {fieldError("tamanoPerro") && (
                        <small className={styles.error}>{errors.tamanoPerro}</small>
                    )}
                </label>

                <label>
                    Raza de tu perro:
                    <input
                        type="text"
                        name="raza"
                        value={formData.raza}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("raza")}
                    />
                    {fieldError("raza") && (
                        <small className={styles.error}>{errors.raza}</small>
                    )}
                </label>

                <button type="submit">Guardar</button>
            </form>

            {/* POPUP  */}
            {showSuccess && (
                <div
                    className={styles.overlay}
                    role="presentation"
                    onClick={() => setShowSuccess(false)}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>¡Paseo registrado con éxito!</h3>
                        <p>Los datos se enviaron correctamente. Proximamente un paseador se comunicará con vos.</p>
                        <button type="button" onClick={() => setShowSuccess(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
