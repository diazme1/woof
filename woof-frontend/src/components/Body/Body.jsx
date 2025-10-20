import React, {useEffect, useState} from "react";
import styles from "./Body.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";

const Body = () => {

    const [precio, setPrecio] = useState();

    useEffect(() => {
        axios
            .get(`http://localhost:8080/paseo/precio`)
            .then((res) => {
                setPrecio(res.data);
            })
            .catch(() => setPrecio(0));
        console.log("Precio actual recuperado:", precio);
    }, []);

    const ShieldIcon = ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
            <path d="M12 3l7 3v5c0 4.5-2.9 8.6-7 10-4.1-1.4-7-5.5-7-10V6l7-3z" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M16 10l-4 4-2-2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const LockCardIcon = ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="18" height="12" rx="2" strokeWidth="1.8"/>
            <path d="M7 7V6a5 5 0 0 1 10 0v1" strokeWidth="1.8"/>
            <circle cx="12" cy="13" r="1.2" fill="currentColor"/>
            <path d="M12 14.2V16" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
    );

    const PawInfoIcon = ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
            <circle cx="7" cy="8" r="2.2" strokeWidth="1.6"/>
            <circle cx="17" cy="8" r="2.2" strokeWidth="1.6"/>
            <circle cx="9" cy="5" r="1.4" strokeWidth="1.6"/>
            <circle cx="15" cy="5" r="1.4" strokeWidth="1.6"/>
            <path d="M7 17c1.5-2.5 8.5-2.5 10 0 .7 1.2-.2 3-2 3H9c-1.8 0-2.7-1.8-2-3z" strokeWidth="1.6"/>
            <path d="M12 11v5" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
    );

    const formatearPrecio = (valor) => {
        if (valor === null || valor === undefined || isNaN(valor)) return "0,00";
        return valor.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <main style={{
            maxWidth: "1000px",
            margin: "50px auto",
            padding: "0 20px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.6,
            color: "#333"
        }}>

            <div className={styles.fadeIn}>
                <p>
                    Somos un equipo de amantes de los animales que entendemos lo importante que es cada paseo para tu
                    perro.
                    Por eso creamos Woof! Una app en la que los dueños ocupados pueden encontrar paseadores confiables
                    cerca de su zona, con perfiles verificados y reseñas reales.
                </p>
                <p>¿Nuestro objetivo? Comodidad para el dueño y felicidad para la mascota</p>
            </div>

            <div style={{maxWidth: "800px", margin: "50px auto"}}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{clickable: true}}
                    loop={true}
                    style={{width: "100%", height: "500px", borderRadius: "20px", overflow: "hidden"}}
                >
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito3.jpg" alt="Perrito 3" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito2.jpg" alt="Perrito 2" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito1.jpg" alt="Perrito 1" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito4.jpg" alt="Perrito 4" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito5.jpg" alt="Perrito 5" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito6.jpg" alt="Perrito 6" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito8.jpg" alt="Perrito 8" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito7.jpg" alt="Perrito 7" className={styles.slideImage}/>
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito9.jpg" alt="Perrito 9" className={styles.slideImage}/>
                    </SwiperSlide>
                </Swiper>
            </div>

            <div>
                <section id="como-funciona" className={styles.container}>
                    <h1 className={styles.title}>¿Cómo funciona Woof?</h1>
                    <ul className={styles.stepsList}>
                        <li className={styles.stepCard}>
                            <h3>1. Registrate🔑</h3>
                            <p>Creá tu cuenta en Woof completando tus datos. Podés elegir registrarte como cliente,
                                para solicitar paseos, o como paseador, para ofrecer el servicio.
                                Inicia sesión con tu email y contraseña para acceder a todas las funciones.</p>
                        </li>
                        <li className={styles.stepCard}>
                            <h3>2. Solicitá un paseo📅</h3>
                            <p>Si sos cliente, seleccioná el día y la hora en que necesitás el paseo.
                                Podés incluir detalles como la duración o indicaciones especiales para tu perro.</p>
                        </li>
                        <li className={styles.stepCard}>
                            <h3>3. Esperá la aceptación⏳</h3>
                            <p>La solicitud será enviada a los paseadores disponibles en tu zona.
                                Cuando uno la acepte, vas a recibir la notificación en tu cuenta y por correo
                                electrónico.</p>
                        </li>
                        <li className={styles.stepCard}>
                            <h3>4. A disfrutar el paseo!🐾</h3>
                            <p>Con la aceptación confirmada, tu perro ya tiene paseo asegurado!
                                El paseador pasa en el horario acordado y el servicio queda registrado en la
                                plataforma.</p>
                        </li>
                    </ul>
                </section>
            </div>

            <section id="por-que-elegirnos" className={styles.porqueElegirnos}>
                <h1 className={styles.title}>¿Por qué elegirnos?</h1>
                <p>
                    Tu perro en buenas manos, siempre!<br/>
                    Verificación de paseadores y comunicación transparente en cada paseo.
                </p>
                <img src="/perritoPorQueElegirnos.png" alt="Perrito con computadora" className={styles.sectionImage}/>
                <h3>Nuestros diferenciales</h3>
                <ul>
                    <li>🛡️ <strong>Seguridad verificada:</strong> Cada paseador debe pasar por un proceso de validación
                        de identidad y chequeo de antecedentes antes de ser aprobado. Esto genera confianza al dueño de
                        la mascota.
                    </li>
                    <li>🐕 <strong>Calidad del servicio:</strong> Nuestros cuidadores son apasionados y experimentados,
                        lo que garantiza que las mascotas reciban amor y atención.
                    </li>
                    <li>👀 <strong>Transparencia total:</strong> Durante cada paseo se registran el check-in y el
                        check-out, además de permitir compartir notas y un chat en tiempo real con el paseador,
                        reforzando la tranquilidad del usuario.
                    </li>
                    <li>⭐ <strong>Calidad con feedback:</strong> Los dueños califican a los paseadores y los paseadores
                        también califican a los dueños. Esto fomenta un ecosistema justo y confiable.
                    </li>
                    <li>💳 <strong>Pagos protegidos:</strong> El sistema de pago integrado está certificado, lo que
                        asegura transacciones seguras y evita fraudes.
                    </li>
                    <li>📞 <strong>Soporte claro 24/7:</strong> Un canal de ayuda está siempre
                        disponible con tiempos de respuesta inmediatos para resolver cualquier inconveniente.
                    </li>
                </ul>
            </section>

            {/* --- PRECIO --- */}
            <section id="precios" aria-labelledby="precio-title" className={styles.securitySection}>
                <div className={styles.securityContent}>
                    <h1 id="precio-title" className={styles.title}>Precios en Woof</h1>
                    <p className={styles.securityIntro}>
                        Sabemos que la felicidad de tu mascota no tiene precio, pero nos aseguramos de que nuestros servicios de alta calidad tengan una tarifa justa y transparente.
                    </p>
                </div>

                <div
                    className={styles.securityGrid}
                    style={{ gridTemplateColumns: '1fr', maxWidth: '520px', margin: '0.0rem auto 0' }}
                >
                    <article className={styles.securityCard}
                             style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span className={styles.iconCircle} aria-hidden="true" style={{ marginRight: 12 }}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 2"></path>
                  </svg>
                </span>

                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <h3 className={styles.securityCardTitle} style={{ marginBottom: 8 }}>
                                Paseo 1 hora (60 min)
                            </h3>

                            <p className={styles.securityCardText} style={{ margin: 0 }}>
                                Precio:
                                <strong style={{ fontSize: '1.9rem', color: '#007c7d', marginLeft: 8 }}>
                                    ${formatearPrecio(precio)}
                                </strong>
                            </p>

                            <p className={styles.securityCardText} style={{ marginTop: 8 }}>
                                Tarifa fija. Se ve antes de confirmar tu solicitud.
                            </p>
                        </div>
                    </article>
                </div>
            </section>



            {/* --- SEGURIDAD --- */}
            <section id="seguridad" aria-labelledby="seguridad-title" className={styles.securitySection}>
                <div className={styles.securityContent}>
                    <h1 id="seguridad-title" className={styles.title}>Seguridad en cada paseo</h1>
                    <p className={styles.securityIntro}>
                        Cuando un paseador se postula en Woof!, revisamos cuidadosamente sus datos, currículum y documentos.
                        Solo quienes cumplen con los requisitos de identidad y experiencia son aprobados para recibir solicitudes.
                        Así aseguramos que cada paseo sea realizado por alguien confiable y capacitado.
                    </p>

                    <div className={styles.securityGrid}>
                        {/* Card 1 - Verificación */}
                        <article className={styles.securityCard}>
                            <span className={styles.iconCircle} aria-hidden>
                                <ShieldIcon className={styles.icon}/>
                            </span>
                            <div>
                                <h3 className={styles.securityCardTitle}>Verificación y antecedentes</h3>
                                <p className={styles.securityCardText}>
                                    Validamos identidad y documentación de cada paseador antes de habilitarlo. Revisión periódica para mantener el estándar.
                                </p>
                            </div>
                        </article>

                        {/* Card 2 - Pagos seguros */}
                        <article className={styles.securityCard}>
                            <span className={styles.iconCircle} aria-hidden>
                                <LockCardIcon className={styles.icon}/>
                            </span>
                            <div>
                                <h3 className={styles.securityCardTitle}>Pagos seguros y confiables</h3>
                                <p className={styles.securityCardText}>
                                    Sistema certificado que protege la información financiera de clientes y paseadores, evitando fraudes.
                                </p>
                            </div>
                        </article>

                        {/* Card 3 - Diferencial de cada mascota */}
                        <article className={styles.securityCard}>
                            <span className={styles.iconCircle} aria-hidden>
                                <PawInfoIcon className={styles.icon}/>
                            </span>
                            <div>
                                <h3 className={styles.securityCardTitle}>Diferencial de cada mascota</h3>
                                <p className={styles.securityCardText}>
                                    Al crear una solicitud, podés detallar comportamiento, rutinas, preferencias o restricciones.
                                    El paseador llega informado y preparado, logrando un paseo más seguro y adaptado.
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Body;