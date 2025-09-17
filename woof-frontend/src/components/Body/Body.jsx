import React from "react";
import styles from "./Body.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Body = () => {
    return (
        <main style={{
            maxWidth: "800px",
            margin: "50px auto",
            padding: "0 20px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.6,
            color: "#333" }}>

            <div className={styles.fadeIn}>
                <p>
                    Somos un equipo de amantes de los animales que entendemos lo importante que es cada paseo para tu perro.
                    Por eso creamos Woof! Una app en la que los dueños ocupados pueden encontrar paseadores confiables cerca de su zona, con perfiles verificados y reseñas reales.
                </p>
                <p>¿Nuestro objetivo? Comodidad para el dueño y felicidad para la mascota</p>
            </div>

            <div style={{ maxWidth: "800px", margin: "50px auto" }}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    style={{ width: "100%", height: "500px", borderRadius: "20px", overflow: "hidden" }}
                >
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito3.jpg" alt="Perrito 3" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito2.jpg" alt="Perrito 2" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito1.jpg" alt="Perrito 1" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito4.jpg" alt="Perrito 4" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito5.jpg" alt="Perrito 5" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito6.jpg" alt="Perrito 6" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito8.jpg" alt="Perrito 8" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito7.jpg" alt="Perrito 7" className={styles.slideImage} />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <img src="/perrito9.jpg" alt="Perrito 9" className={styles.slideImage} />
                    </SwiperSlide>
                </Swiper>
            </div>

            <div>
                <section id="como-funciona" style={{ padding: "2rem"}}>
                    <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                            ¿Cómo funciona Woof?
                    </h2>
                    <p>
                        <strong>Registrate:</strong> Creá tu cuenta en Woof completando tus datos.
                        Podés elegir registrarte como cliente, para solicitar paseos, o como paseador,
                        para ofrecer el servicio. Inicia sesión a la plataforma con tu email y contraseña
                        para acceder a todas las funciones.
                    </p>
                    <p>
                        <strong>Solicitá un paseo:</strong> Si sos cliente, seleccioná el día y la hora en que
                        necesitás el paseo. Podés incluir detalles como la duración o indicaciones especiales
                        para tu perro.
                    </p>
                    <p>
                        <strong>Esperá la aceptación:</strong> La solicitud será enviada a los paseadores disponibles
                        en tu zona. Cuando uno la acepte, vas a recibir la notificación en tu cuenta y por correo electrónico.
                    </p>
                    <p>
                        <strong>Confirmación y paseo:</strong> Con la aceptación confirmada, tu perro ya tiene paseo asegurado!
                        El paseador pasa en el horario acordado y el servicio queda registrado en la plataforma.
                    </p>
                </section>
            </div>
        </main>
    );
};

export default Body;