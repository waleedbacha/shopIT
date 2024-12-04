import catchAsynErrors from "../middlewares/catchAsynErrors.js";
import Product from "../models/product.js"
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";


// Create new Order => /api/v1/orders/new //

export const newOrder = catchAsynErrors(async(req,res,next)=> {
const  {
orderItems,
shippingInfo,
itemsPrice,
taxAmount,
shippingAmount,
totalAmount,
paymentMethod,
paymentInfo,
} = req.body;

const order = await Order.create({
orderItems,
shippingInfo,
itemsPrice,
taxAmount,
shippingAmount,
totalAmount,
paymentMethod,
paymentInfo,
user: req.user._id,
});

res.status(200).json({
order,    
})

});

//  Get Current User Orders => /api/v1/me/orders //

export const myOrders = catchAsynErrors(async (req, res, next) => {
const orders = await Order.find({ user: req.user._id});

res.status(200).json({
orders,    
});
    
});

//  Get Order Details => /api/v1/orders/:id //

export const getOrderDetails = catchAsynErrors(async (req, res, next) => {
const order = await Order.findById(req.params.id).populate("user", "name email");
if(!order){
return next(new ErrorHandler("No Order found with this id.", 404));
}

res.status(200).json({
order,    
});

});

//  Get all Orders -Admin => /api/v1/admin/orders //

export const allOrders = catchAsynErrors(async (req, res, next) => {
    const orders = await Order.find();
       
    
        res.status(200).json({
        orders,    
        });
        
        });

//  Update Orders -Admin => /api/v1/admin/orders/:id //

export const updateOrders = catchAsynErrors(async (req, res, next) => {
const order = await Order.findById(req.params.id);
if(!order){
return next(new ErrorHandler("No Order found by this id.", 404));
}
if(order?.orderStatus === "Delivered"){
return next(new ErrorHandler("You have already delivered this order", 404));
}

let productNotFound =  false;
       
// Update product stock  //

for(const item of order.orderItems) {
const product = await Product.findById(item?.product?.toString());

if(!product){
    productNotFound = true;
    break;
};

product.stock = product.stock - item.quantity;
await product.save({validateBeforeSave: false});
};

if(!productNotFound){
    return next(new ErrorHandler("No product found with one or more IDs", 404));    
    }

order.orderStatus = req.body.status;
order.deliveredAt = Date.now();

await order.save();

res.status(200).json({
success: true,    
});
        
});
    
//  Delete Order  => /api/v1/admin/orders/:id //

export const deleteOrders = catchAsynErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
    return next(new ErrorHandler("No Order found with this id.", 404));
    }
    await order.deleteOne();

    res.status(200).json({
    success:true,    
    });
    
    });

