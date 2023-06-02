class ResponseHandler {
    constructor(data, error = null) {
        this.data = data;
        this.error = error;
    }
}

class MessageHandler {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ResponseHandler;
module.exports = MessageHandler;
