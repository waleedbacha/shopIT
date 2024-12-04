import catchAsynErrors from "./catchAsynErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Check if user is authenticated or not
const isAuthenticatedUser = catchAsynErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if(!token){    
    
    return next(new ErrorHandler("Login first to access this resource", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
});

// Authorize User Role //

export const authorizeRoles = (...roles) => {
    return(req, res, next) => {
   if(!roles.includes(req.user.role)) {
    return next(
        new ErrorHandler(
            `Role (${req.user.role}) is not allowed to acces this resource.`, 403 
        )
    );
    }
    next();
   };

    };


export default isAuthenticatedUser;
