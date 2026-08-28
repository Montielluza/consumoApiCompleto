/** Códigos de error observados en el Swagger. La API puede enviar otros no listados aquí. */
export type ApiErrorCode =
    | 'MISSING_TOKEN'
    | 'TOKEN_EXPIRED'
    | 'INVALID_TOKEN'
    | 'INVALID_CREDENTIALS'
    | 'FORBIDDEN'
    | string;

export interface ApiErrorBody {
    code: ApiErrorCode;
    message: string;
}

/** Forma de ErrorResponse tal como la define el Swagger. */
export interface ApiErrorResponse {
    error: ApiErrorBody;
}