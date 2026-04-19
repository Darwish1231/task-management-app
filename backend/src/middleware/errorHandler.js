const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Handle Mongoose Cast Error (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id of ${err.value}`;
    }
    
    res.status(statusCode).json({
        success: false,
        msg: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
