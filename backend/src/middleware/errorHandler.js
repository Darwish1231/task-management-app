const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        msg: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
