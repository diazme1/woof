import {useState} from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
// import logo from "../../assets/logo.png";

// <img src={logo} alt="Logo" className={styles.footerLogo} /> en linea 14
const Footer = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>

                {/* Izquierda: Logo + copyright */}
                <div className={styles.footerLeft}>
                    <p className={styles.footerText}>© Global Pro Care Inc.</p>
                </div>

                {/* Centro: Links */}
                <div className={styles.footerLinks}>
                    <a href="/contacto" className={styles.footerLink}>Contacto</a>
                    <span>-</span>
                    <a href="/privacidad" className={styles.footerLink}>Política de Privacidad</a>
                    <span>-</span>
                    <a href="/terminos" className={styles.footerLink}>Términos y Condiciones</a>
                    <span>-</span>
                    <a href="/paises" className={styles.footerLink}>Woof.com en Otros Países</a>
                </div>

                {/* Derecha: Redes sociales */}
                <div className={styles.footerSocials}>
                    <a href="#" className={styles.footerIcon}><FaInstagram/></a>
                    <a href="#" className={styles.footerIcon}><FaWhatsapp/></a>
                    <a href="#" className={styles.footerIcon}><FaTiktok/></a>
                    <a href="#" className={styles.footerIcon}><FaYoutube/></a>
                    <a href="#" className={styles.footerIcon}><FaTwitter/></a>
                    <a href="#" className={styles.footerIcon}><FaFacebook/></a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;