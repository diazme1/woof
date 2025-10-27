package ar.edu.unq.woof.configuration;

import ar.edu.unq.woof.modelo.Precio;
import ar.edu.unq.woof.modelo.Resenia;
import ar.edu.unq.woof.modelo.SolicitudPaseo;
import ar.edu.unq.woof.modelo.Usuario;
import ar.edu.unq.woof.modelo.enums.*;
import ar.edu.unq.woof.persistence.PrecioDAO;
import ar.edu.unq.woof.persistence.ReseniaDAO;
import ar.edu.unq.woof.persistence.SolicitudPaseoDAO;
import ar.edu.unq.woof.persistence.UserDAO;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Configuration
@Profile("dev") // Solo se ejecuta en perfil dev
public class DataInitializer {

    private final UserDAO userDAO;
    private final SolicitudPaseoDAO solicitudPaseoDAO;
    private final ReseniaDAO reseniaDAO;
    private final PrecioDAO precioDAO;

    public DataInitializer(UserDAO userDAO, SolicitudPaseoDAO solicitudPaseoDAO,
                          ReseniaDAO reseniaDAO, PrecioDAO precioDAO) {
        this.userDAO = userDAO;
        this.solicitudPaseoDAO = solicitudPaseoDAO;
        this.reseniaDAO = reseniaDAO;
        this.precioDAO = precioDAO;
    }

    @PostConstruct
    @Transactional
    public void init() {
        // Limpiar datos existentes
        reseniaDAO.deleteAll();
        solicitudPaseoDAO.deleteAll();
        userDAO.deleteAll();
        precioDAO.deleteAll();

        // Crear precio base
        Precio precio = new Precio(5000.0f);
        precioDAO.save(precio);

        // Usuario Administrador
        Usuario admin = new Usuario(
            "Admin Rodriguez",
            99999999,
            "admin@woof.com",
            "1155667788",
            "Universidad Nacional de Quilmes, Bernal",
            "Admin@123",
            UserRole.ROLE_ADMIN,
            null,
            null
        );
        admin.setEstadoValidacion(EstadoValidacion.NO_ENVIADO);
        userDAO.save(admin);

        // Usuario Cliente
        Usuario cliente = new Usuario(
            "María González",
            35123456,
            "cliente@woof.com",
            "1144556677",
            "Av. Calchaquí 1234, Quilmes",
            "Cliente@123",
            UserRole.ROLE_CLIENTE,
            null,
            null
        );
        cliente.setEstadoValidacion(EstadoValidacion.NO_ENVIADO);
        userDAO.save(cliente);

        // Paseador NO validado
        Usuario paseadorNoValidado = new Usuario(
            "Juan Pérez",
            30456789,
            "paseador.novalidado@woof.com",
            "1166778899",
            "Calle Mitre 567, Bernal",
            "Paseador@123",
            UserRole.ROLE_PASEADOR,
            "juanpaseador",
            "Amante de los perros con 2 años de experiencia."
        );
        paseadorNoValidado.setEstadoValidacion(EstadoValidacion.PENDIENTE);
        paseadorNoValidado.setFotoDni("uploads/dni_juan.jpg");
        paseadorNoValidado.setCv("uploads/cv_juan.pdf");
        userDAO.save(paseadorNoValidado);

        // Paseador VALIDADO
        Usuario paseadorValidado = new Usuario(
            "Carlos Fernández",
            28987654,
            "paseador.validado@woof.com",
            "1177889900",
            "Av. Hipólito Yrigoyen 890, Quilmes",
            "Paseador@123",
            UserRole.ROLE_PASEADOR,
            "carlospaseador",
            "Paseador profesional con más de 5 años de experiencia cuidando mascotas. Amo a los animales y disfruto cada paseo."
        );
        paseadorValidado.setEstadoValidacion(EstadoValidacion.APROBADO);
        paseadorValidado.setFotoDni("uploads/dni_carlos.jpg");
        paseadorValidado.setCv("uploads/cv_carlos.pdf");
        userDAO.save(paseadorValidado);

        // Paseo pendiente para hoy a las 7:30 PM (19:30)
        LocalDateTime hoyNoche = LocalDateTime.now()
            .withHour(19)
            .withMinute(30)
            .withSecond(0)
            .withNano(0);

        SolicitudPaseo paseoPendiente = new SolicitudPaseo(
            ZonaOperativa.QUILMES,
            hoyNoche,
            "Rocky",
            TamanoPerro.MEDIANO,
            "Labrador",
            cliente.getId(),
            "Mi perro es muy juguetón y le encanta correr. Por favor lleven agua."
        );
        paseoPendiente.setEstadoDeSolicitud(EstadoSolicitud.PENDIENTE);
        paseoPendiente.setEstadoDePago(EstadoDePago.PENDIENTE_DE_PAGO);
        solicitudPaseoDAO.save(paseoPendiente);

        // Paseo finalizado 1 (hace 15 días)
        LocalDateTime hace15Dias = LocalDateTime.now()
            .minusDays(15)
            .withHour(16)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);

        SolicitudPaseo paseoFinalizado1 = new SolicitudPaseo(
            ZonaOperativa.BERNAL,
            hace15Dias,
            "Max",
            TamanoPerro.GRANDE,
            "Golden Retriever",
            cliente.getId(),
            "Perro muy tranquilo, solo necesita un paseo relajado."
        );
        paseoFinalizado1.setIdPaseador(paseadorValidado.getId());
        paseoFinalizado1.setEstadoDeSolicitud(EstadoSolicitud.FINALIZADA);
        paseoFinalizado1.setEstadoDePago(EstadoDePago.PAGO);
        solicitudPaseoDAO.save(paseoFinalizado1);

        // Reseña para paseo finalizado 1
        Resenia resenia1 = new Resenia(
            paseadorValidado.getId(),
            cliente.getId(),
            paseoFinalizado1.getId(),
            5,
            "¡Excelente servicio! Carlos es muy profesional y se nota que ama a los animales. Max llegó feliz y cansado del paseo."
        );
        reseniaDAO.save(resenia1);

        // Paseo finalizado 2 (hace 7 días)
        LocalDateTime hace7Dias = LocalDateTime.now()
            .minusDays(7)
            .withHour(18)
            .withMinute(30)
            .withSecond(0)
            .withNano(0);

        SolicitudPaseo paseoFinalizado2 = new SolicitudPaseo(
            ZonaOperativa.QUILMES,
            hace7Dias,
            "Luna",
            TamanoPerro.PEQUENO,
            "Beagle",
            cliente.getId(),
            "Luna es muy energética, necesita una buena caminata."
        );
        paseoFinalizado2.setIdPaseador(paseadorValidado.getId());
        paseoFinalizado2.setEstadoDeSolicitud(EstadoSolicitud.FINALIZADA);
        paseoFinalizado2.setEstadoDePago(EstadoDePago.PAGO);
        solicitudPaseoDAO.save(paseoFinalizado2);

        // Reseña para paseo finalizado 2
        Resenia resenia2 = new Resenia(
            paseadorValidado.getId(),
            cliente.getId(),
            paseoFinalizado2.getId(),
            4,
            "Muy buen paseador, muy puntual y responsable. Luna disfrutó mucho del paseo. Lo recomiendo!"
        );
        reseniaDAO.save(resenia2);

        System.out.println("✅ Datos de prueba inicializados correctamente");
        System.out.println("📧 Usuarios creados:");
        System.out.println("   - Admin: admin@woof.com / Admin@123");
        System.out.println("   - Cliente: cliente@woof.com / Cliente@123");
        System.out.println("   - Paseador no validado: paseador.novalidado@woof.com / Paseador@123");
        System.out.println("   - Paseador validado: paseador.validado@woof.com / Paseador@123");
    }
}

