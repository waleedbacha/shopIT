import ErrorHandler from "../utils/errorHandler.js";

export default(err, req, res, next) => {

let error = {

statusCode: err?.statusCode || 500,
message: err?.message || "Internal server error",
};


// Handle Invalid Mongoose ID error//
if(err.name === 'CastError') {
    const message= `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
}

// Handle Validation error//
if(err.name === 'ValidationError') {
    const message= Object.values(err.errors).map((value) => value.message);     
    error = new ErrorHandler(message, 400);
}

// Handle  Mongoose Duplicate ID Error //
if(err.name === 1100) {
const message= `Deplicate ${Object.keys(err.keyValue)} entered`;
error = new ErrorHandler(message, 400);
}

// Handle wrong JWT Error //
if(err.name === "JsonWebTokenError") {
const message= `Json web token is invalid!!!`;
error = new ErrorHandler(message, 400);
}

// Handle expired JWT Error //
if(err.name === "TokenExpireError") {
    const message= `Json web token is invalid!!!`;
    error = new ErrorHandler(message, 400);
    }


if(process.env.NODE_ENV === "DEVELOPMENT"){
    res.status(error.statusCode).json({
        message: error.message,
        error: err,
         stack: err?.stack, 
        });
   };


if(process.env.NODE_ENV === "PRODUCTION"){
    res.status(error.statusCode).json({
        message: error.message,
   
        });
   };
};




 