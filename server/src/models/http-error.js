class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //adds a "message" property
        this.code = errorCode; //adds a "code" propery
    }
}

module.exports = HttpError;
