package ar.edu.unq.woof.modelo.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {
    private int response_code;
    private String description;

    public ErrorResponse(int response_code, String description) {
        this.response_code = response_code;
        this.description = description;
    }
}
