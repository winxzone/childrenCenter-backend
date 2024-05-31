export default class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    // 404 - Ошибка "Not Found". Это означает, что запрашиваемый ресурс не найден на сервере.
    static badRequest(message) {
        return new ApiError(404, message);
    }
    // 500 - Внутренняя ошибка сервера. Это общая ошибка, которая указывает на то, что что-то пошло не так на стороне сервера.
    static internal(message) {
        return new ApiError(500, message);
    }
    // 403 - Ошибка "Forbidden". Это означает, что сервер понял запрос, но отказывается его выполнить из-за ограничений доступа.
    static forbidden(message) {
        return new ApiError(403, message);
    }
    // 401 - Ошибка "Unauthorized". Это означает, что клиент не предоставил необходимые аутентификационные данные для доступа к ресурсу.
    static unauthorized(message) {
        return new ApiError(401, message);
    }
}
