const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        // stack trace only in development
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

module.exports = { errorMiddleware };
