package ar.edu.unq.woof.controller.dto.resenia;

import ar.edu.unq.woof.modelo.Resenia;

public record ReseniaDTO(
        Long id,
        Long idPaseador,
        Long idCliente,
        Long idPaseo,
        String descripcion,
        Integer puntuacion
) {
    public static  ReseniaDTO desdeModelo(Resenia resenia){
        return new ReseniaDTO(
                resenia.getId(),
                resenia.getIdPaseador(),
                resenia.getIdCliente(),
                resenia.getIdPaseo(),
                resenia.getDescripcion(),
                resenia.getPuntuacion()
        );
    }
}
