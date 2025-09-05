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
        </main>
    );
};

export default Body;