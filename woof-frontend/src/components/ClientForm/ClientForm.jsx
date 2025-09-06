// ClientForm.jsx
import { useState, useEffect } from "react";
import styles from "./ClientForm.module.css";

const initial = { fullName: "", email: "", phone: "", address: "" };
const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (v) => {
    const errors = {};
    if (!v.fullName.trim()) errors.fullName = "Ingresá tu nombre completo.";
    if (!v.email.trim()) errors.email = "Ingresá tu email.";
    else if (!emailRE.test(v.email)) errors.email = "Email inválido.";
    if (!v.phone.trim()) errors.phone = "Ingresá tu teléfono.";
    else if (!/^\d{8,15}$/.test(v.phone)) errors.phone = "Solo dígitos (8–15).";
    if (!v.address.trim()) errors.address = "Ingresá tu dirección.";
    return errors;
};

export default function ClientForm() {
    const [formData, setFormData] = useState(initial);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const nextErrors = validate(formData);
        setErrors(nextErrors);
        setTouched({ fullName: true, email: true, phone: true, address: true });
        if (Object.keys(nextErrors).length) return;

        //mostrar pop up
        setFormData(initial);
        setTouched({});
        setErrors({});
        setShowSuccess(true);
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
                <h2>Formulario de Cliente</h2>

                <label>
                    Nombre completo:
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("fullName")}
                    />
                    {fieldError("fullName") && (
                        <small className={styles.error}>{errors.fullName}</small>
                    )}
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("email")}
                    />
                    {fieldError("email") && (
                        <small className={styles.error}>{errors.email}</small>
                    )}
                </label>

                <label>
                    Teléfono:
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inputMode="numeric"
                        aria-invalid={!!fieldError("phone")}
                    />
                    {fieldError("phone") && (
                        <small className={styles.error}>{errors.phone}</small>
                    )}
                </label>

                <label>
                    Dirección:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("address")}
                    />
                    {fieldError("address") && (
                        <small className={styles.error}>{errors.address}</small>
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
                        <h3>¡Registro realizado con exito!</h3>
                        <p>Los datos se enviaron correctamente. Proximamente nos comunicaremos con vos.</p>
                        <button type="button" onClick={() => setShowSuccess(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
