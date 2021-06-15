class myError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
        console.log('***************************');
        console.error(this.stack);
        console.log('***************************');
    }
}


module.exports = myError;