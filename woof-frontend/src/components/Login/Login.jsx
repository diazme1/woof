import { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import ClientForm from "../ClientForm/ClientForm";


const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", contrasena: "" });
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const onChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", loginData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Payload que voy a enviar:", {
                email: loginData.email,
                contrasena: loginData.contrasena
            });

            const res = await axios.post("http://localhost:8080/auth/login", {
                email: loginData.email,
                contrasena: loginData.contrasena,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({
                nombre: res.data.nombre,
                email: res.data.email,
                rol: res.data.rol
            }));

            window.location.href = "/";
        } catch (err) {
            setError("Credenciales inválidas");
            console.error("Error al enviar datos:", err);
            alert("Hubo un problema al iniciar sesión. Intenta nuevamente más tarde.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={onChange}
                        required
                        autoComplete="email"
                    />
                </label>

                <label>
                    Contraseña
                    <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        value={loginData.contrasena}
                        onChange={onChange}
                        required
                        autoComplete="current-contrasena"
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
                </label>

                <button type="submit">Entrar</button>

                <p className={styles.helper}>
                    ¿No tiene una cuenta?{" "}
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => setShowRegister(true)}
                    >
                        Cree una
                    </button>
                </p>
            </form>

            {/* Modal de registro */}
            {showRegister && (
                <div
                    className={styles.backdrop}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="register-title"
                    onClick={() => setShowRegister(false)}
                >
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 id="register-title">Registrarme</h3>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowRegister(false)}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <ClientForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Login;

