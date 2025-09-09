// ClientForm.jsx
import { useState, useEffect } from "react";
import styles from "./ClientForm.module.css";
import axios from 'axios';

const initial = { fullName: "", dni:"", email: "", phone: "", address: "", password: "" };
const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validate = (v) => {
    const errors = {};
    if (!v.fullName.trim()) errors.fullName = "Ingresá tu nombre completo.";
    if(!v.dni.trim()) errors.dni="Ingresá tu número de documento.";
    else if (!/^\d+$/.test(v.dni))
        errors.dni = "El DNI solo puede contener números.";
    else if (v.dni.length < 7 || v.dni.length > 8)
        errors.dni = "El DNI debe tener 7 u 8 dígitos.";
    if (!v.email.trim()) errors.email = "Ingresá tu email.";
    else if (!emailRE.test(v.email)) errors.email = "Email inválido.";
    if (!v.phone.trim()) errors.phone = "Ingresá tu teléfono.";
    else if (!/^\d{8,15}$/.test(v.phone)) errors.phone = "Solo dígitos (8–15).";
    if (!v.address.trim()) errors.address = "Ingresá tu dirección.";
    if (!v.password || !v.password.trim()) {
        errors.password = "Ingresá una contraseña.";
    } else if (!passwordRE.test(v.password)) {
        errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
    return errors;
};

export default function ClientForm() {
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
        setTouched({ fullName: true, dni:true, email: true, phone: true, address: true, password: true });
        if (Object.keys(nextErrors).length) return;

        //mostrar pop up
        try {
            // datos al back
            const response = await axios.post("http://localhost:8080/user", {
                nombre: formData.fullName,
                dni: formData.dni,
                email: formData.email,
                telefono: formData.phone,
                direccion: formData.address,
                contrasena: formData.password,
                rol: "PASEADOR" //habría que agregar el campo al form
            });

            console.log("Respuesta del backend:", response.data);

            // success y reset
            setFormData(initial);
            setTouched({});
            setErrors({});
            setShowSuccess(true);
        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Hubo un problema al registrar el cliente. Intenta nuevamente.");
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
                <h2>Formulario de registro</h2>

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
                    Número de documento:
                    <input
                        type="text"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={!!fieldError("dni")}
                    />
                    {fieldError("dni") && (
                        <small className={styles.error}>{errors.dni}</small>
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


                <div className="checkbox-group">
                    <input type="checkbox" id="opcion1" name="opcion1" value="valor1"/>
                    <label htmlFor="opcion1">Soy paseador</label>
                </div>

                <div class="checkbox-group">
                    <input type="checkbox" id="opcion2" name="opcion2" value="valor2"/>
                    <label htmlFor="opcion2">Soy cliente</label>
                </div>

                <label>
                    Contraseña:
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password ?? ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!fieldError("password")}
                            autoComplete="new-password"
                            placeholder="Mín. 8, Mayús, minús, número y símbolo"
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(s => !s)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            aria-pressed={showPassword}
                        >
                            <img
                                src={showPassword ? "/abrir-ojo.png" : "/cerrar-ojo.png"}
                                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            />
                        </button>
                    </div>
                    {fieldError("password") && (
                        <small className={styles.error}>{errors.password}</small>
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
