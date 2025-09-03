import {useState} from "react";
import styles from "./Footer.module.css";

const Footer = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <footer className={styles.footer}>
            <div>Encontranos en:</div>
            <div>📞 +54 1150441233</div>
            <div>📧 info@woof.com</div>
            <div className={styles.socials}>
                <a href="">🌐 Facebook</a>
                <a href="">📸 Instagram</a>
                <a href="">🎥 TikTok</a>
            </div>
            <div>© 2025 Woof! Todos los derechos reservados.</div>

        </footer>
    );
};

export default Footer;