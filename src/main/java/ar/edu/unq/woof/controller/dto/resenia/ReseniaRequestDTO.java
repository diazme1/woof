package ar.edu.unq.woof.controller.dto.resenia;

import ar.edu.unq.woof.modelo.Resenia;

public record ReseniaRequestDTO(
        Long idPaseador,
        Long idCliente,
        Long idPaseo,
        String descripcion,
        Integer puntuacion
) {
    public Resenia aModelo() {
        return new Resenia(idPaseador, idCliente, idPaseo, puntuacion, descripcion);
    }
}
