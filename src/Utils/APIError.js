class APIError extends Error {
    constructor( statusCode,message ) {
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        this.sucess = false;
        this.errors = []
        this.data = null;
       // console.log(" in constructor")
        // if (stack) {
        //     this.stack = stack
        // } else {
        //     Error.captureStackTrace(this, this.constructor)
        // }

    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: this.success,
            errors: this.errors,
            data: this.data,
        };
    }



}

module.exports.APIError = APIError