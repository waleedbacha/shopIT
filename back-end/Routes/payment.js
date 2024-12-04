import express from "express";
import isAuthenticatedUser from "../middlewares/auth.js"; 
import { stripeCheckOutSession, stripeWebhook } from "../Controller/paymentControllers.js";
 
const router = express.Router();


router
.route("/payment/checkout_session")
.post(isAuthenticatedUser, stripeCheckOutSession);


router
.route("/payment/webhook")
.post(stripeWebhook);

export default router;