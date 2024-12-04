import React, { useEffect, useState } from "react";
import MetaData from "../layout/metaData";
import CheckOutSteps from "./CheckOutSteps";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/Helper";
import {useCreateNewOrderMutation, useStripeCheckoutSessionMutation} from "../../redux/API/OrderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const PaymentMethod = () => {

const [method, setMethod] = useState("");
const navigate = useNavigate();

const {shippingInfo, cartItems} = useSelector((state => state.cart));

  const [createNewOrder,  {error, isSuccess} ] =   useCreateNewOrderMutation();

  const [stripeCheckoutSession, {data: checkoutData, error: checkoutError, isLoading}] = useStripeCheckoutSessionMutation();

  useEffect(() =>{
  if(checkoutData){
    window.location.href= checkoutData?.url
  }
  if(checkoutError){
    toast.error(checkoutError?.data?.message);

  }
  }, [checkoutData, checkoutError]);



  useEffect(() => {
    if(error){
  toast.error(error?.data?.message);
}

if(isSuccess)
    {
     navigate("/me/orders?order_success= true")
    
}
  }, [error, isSuccess]);

const submitHandler = (e) => {
    e.preventDefault();

    const { itemsPrice, shippingPrice, taxPrice, totalPrice} = calculateOrderCost(cartItems);


     // Cash On Delivery //

if(method === "COD") {
const orderData= {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice,
    shippingAmount: shippingPrice,
    taxAmount: taxPrice,
    totalAmount: totalPrice,
    paymentInfo: {
        status: "Not paid"
    },
    paymentMethod: "COD",
};

createNewOrder(orderData);

}

        // Card Method //

if(method === "CARD") {
  const orderData= {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice,
    shippingAmount: shippingPrice,
    taxAmount: taxPrice,
    totalAmount: totalPrice,
};
stripeCheckoutSession(orderData);

}
};

return (
<>
<MetaData title= "Payment Method"/>

<CheckOutSteps shipping ConfirmOrder payment/>
<div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e) => setMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e) => setMethod(e.target.value)}

            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
            </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
            {isLoading ? "Going..." : "CONTINUE"}
          </button>
        </form>
      </div>
    </div>

</>

)


}

export default PaymentMethod;