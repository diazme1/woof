// ReseniaForm.jsx
import { useState, useEffect } from "react";
import styles from "./ReseniaForm.module.css";
import axios from 'axios';

const initial = { idPaseador:"", idCliente:"", idPaseo:"", descripcion:"", puntuacion:""};

const validate = (v) => {
    const errors = {};
    if (!v.descripcion.trim()) errors.descripcion = "Campo requerido";
    return errors;
};

export default function ReseniaForm({ idPaseador, idCliente, idPaseo, onClose }) {
    //const { idPaseador, idCliente, idPaseo, onClose} = props;
    const user = JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            idPaseador,
            idCliente,
            idPaseo
        }));
    }, [idPaseador, idCliente, idPaseo]);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors(validate(formData));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name === "comentarios" ? "descripcion" : name]: value }));
        setErrors(validate({ ...formData, [name === "comentarios" ? "descripcion" : name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextErrors = validate(formData);
        setErrors(nextErrors);
        setTouched({ descripcion: true, puntuancion: true});
        if (Object.keys(nextErrors).length) return;

        try {
            const response = await axios.post("http://localhost:8080/resenia", {
                idPaseador: idPaseador,
                idCliente: idCliente,
                idPaseo: idPaseo,
                puntuacion: formData.puntuacion,
                descripcion: formData.descripcion
            });

            console.log("Respuesta del backend:", response.data);

            setFormData(initial);
            setTouched({});
            setErrors({});
            setShowSuccess(true);
        } catch (error) {
            console.error("Error al enviar datos:", error);
            console.error("Datos enviados:", formData, "Comentario", formData.descripcion, "Puntuación:", formData.puntuacion);
            alert("Hubo un problema al cargar tu reseña. Intenta nuevamente más tarde.");
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
                <h2>Contanos tu experiencia!</h2>

                <label>
                    Puntuación:
                    <div className={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={
                                    (hover >= star || formData.puntuacion >= star)
                                        ? styles.starFilled
                                        : styles.starEmpty
                                }
                                onClick={() => setFormData(prev => ({ ...prev, puntuacion: star }))}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {fieldError("puntuacion") && (
                        <small className={styles.errorText}>{errors.puntuacion}</small>
                    )}
                </label>

                <label>
                    Comentario:
                    <textarea
                        name="comentarios"
                        value={formData.descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={5}
                        maxLength={100}
                        className={fieldError("descripcion") ? styles.error : ""}
                        placeholder="Escribe tu reseña aquí..."
                        style={{ whiteSpace: "pre-wrap" }}
                    />
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <small>Se permiten letras, números, signos de puntuación y saltos de línea.</small>
                        <small>{(formData.descripcion?.length || 0)}/100</small>
                    </div>
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
                        <h3>¡Gracias por compartirnos tu opinión!</h3>
                        <button type="button" onClick={() => {
                            setShowSuccess(false);
                            onClose?.();
                        }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
