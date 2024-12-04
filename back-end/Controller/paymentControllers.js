import Stripe from "stripe";
import catchAsynErrors from "../middlewares/catchAsynErrors.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY );


// Create stripe checkout session => /api/v1/payment/checkout_session // 

export const stripeCheckOutSession = catchAsynErrors (
    async (req, res, next) => {
        const body = req?.body;


        const line_items = body?.orderitems?.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item?.name,
                        images: [item?.image],
                        metadata: { productId: item?.product },
                    },
                    unit_amount: item?.price * 100,
                },
                quantity: item?.quantity,
                tax_rates: ["txr_1QNFP0GBsLY1IpWWFgQGIeOU"],
            };
        });
        
    
        const shippingInfo = body?.shippingInfo

        const shipping_rate = body?.itemsPrice >= 200
        ? "shr_1QMvOFGBsLY1IpWWnEPA3QKf"
        : "shr_1QMvMjGBsLY1IpWWbTEnkEz0";

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${process.env.FRONTEND_URL}/me/orders?order_success= true`,
        cancel_url: `${process.env.FRONTEND_URL}`,
        customer_email: req?.user?.email,
        client_reference_id: req?.user?._id?.toString(),
        mode: "payment",
        metadata:  {...shippingInfo, itemPrice: body?.itemsPrice},
        shipping_options: [
        {
        shipping_rate,
        },
        ],
        line_items,
        });

        console.log(session);


        res.status(200).json({
        url: session.url,
        });
    }
) 

// Create new order after payment => /api/v1/payment/webhook // 

export const stripeWebhook = catchAsynErrors(
    async (req, res, next) => { 

 try{

    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
    );

    if(event.type === "checkout.session.completed") {
       const session = event.data.object;
       console.log("session =>", session)

       res.status(200).json({
        success:true,
       })
    }

 }
 catch(error) {
    console.log("Error =>", error);
 }


    }
)