import { useState } from "react";
import styles from "./Login.module.css";
import ClientForm from "../ClientForm/ClientForm";


const Login = () => {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showRegister, setShowRegister] = useState(false);

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
            const res = await axios.post("http://localhost:8080/user/login", {
                email: loginData.email,
                contrasena: loginData.contrasena,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("usuario", JSON.stringify(res.data));

            window.location.href = "/";
        } catch (err) {
            setError("Credenciales inválidas");
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
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={onChange}
                        required
                        autoComplete="current-password"
                    />
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

