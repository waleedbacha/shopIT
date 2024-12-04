import express from "express";
const app= express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddlewares from "./middlewares/errors.js";

// Handle Uncought Exception //
process.on("uncaughtException", (err) =>{
console.log('ERROR: ${err}');
console.log("Shutting down due to Uncaught Exception");
process.exit(1);
});

dotenv.config({path: "back-end/config/config.env"});

// connection to database //
connectDatabase();

app.use(express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },

}));
app.use(cookieParser());


// import all routes // 
import productRoutes from "./Routes/products.js";
import authRoutes from "./Routes/auth.js";
import orderRoutes from "./Routes/order.js";
import paymentRoutes from "./Routes/payment.js";



app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);


// Using error Middlewares // 
app.use(errorMiddlewares);


const server = app.listen(process.env.PORT, () => {
console.log(`Server started on: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});


// Handle unhandled rejection promise
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`); // Correct use of template literal
    console.log("Shutting down the server due to an Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1); // Exit process after the server shuts down
    });
});
