import {useState} from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";


const Footer = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>

                {/* Izquierda: Logo + copyright */}
                <div className={styles.footerLeft}>
                    <img src="/logo_circular.png" alt="Logo" className={styles.footerLogo} />
                    <p className={styles.footerText}>© Global Pro Care Inc.</p>
                </div>


                <div className={styles.footerSocials}>
                    <a  href="https://www.instagram.com/WoofArgentinaOk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerIcon}><FaInstagram/></a>
                    <a href="https://wa.me/5491156238162"
                       target="_blank"
                       rel="noopener noreferrer"
                       className={styles.footerIcon}><FaWhatsapp/></a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;