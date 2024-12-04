import catchAsynErrors from "../middlewares/catchAsynErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import {delete_file, upload_file} from "../utils/Cloudinary.js"

//   create new product = api/v1//product    //

    export const getproducts = catchAsynErrors(async (req, res, next) => {
     
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    // Displaying error message using Toast: "return next(new ErrorHandler("Products error", 400));"" //

    apiFilters.pagination(resPerPage);
    products= await apiFilters.query.clone();


res.status(200).json( { 
resPerPage,
filteredProductsCount,    
products,
});
});


//   create new product = api/v1/admin/product    //

export const newProduct = catchAsynErrors(async (req , res) => {

    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(200).json( { 
    product,
    });
    });
    

    //  Get single product details = api/v1/admin/products/id    //

export const getProductDetails =  catchAsynErrors(async (req , res, next) => {
    const product = await Product.findById(req?.params?.id).populate('reviews.user');
    if (!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json( { 
    product,
    });
    });

     //  Get product Admin = api/v1/admin/products  //

    export const getAdminProducts =  catchAsynErrors(async (req , res, next) => {
    const products = await Product.find();
    
    res.status(200).json( { 
    products,
    });
    });
    
   //  Update product details => api/v1/admin/products/id    //

   export const updateProduct = catchAsynErrors(async (req , res) => {
   let product = await Product.findById(req?.params?.id);

    if (!product){
        return next(new ErrorHandler("Product not found", 404));
    }
      product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true ,});
      
    res.status(200).json( { 
    product,
    });
    });

      //  Upload product image  => api/v1/admin/products/:id/upload_images   //

      export const uploadProductImage = catchAsynErrors(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
      
        if (!product) {
          return next(new ErrorHandler("Product not found", 404));
        }
      
        const uploader = async (image) => upload_file(image, "shopIT/products");
        const urls = await Promise.all(req.body.images.map(uploader));
      
        product.images.push(...urls);
        await product.save();
      
        res.status(200).json({
          success: true,
          product,
        });
      });
      
      //  Delete product image  => api/v1/admin/products/:id/delete_image   //

      export const deleteProductImage = catchAsynErrors(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
      
        if (!product) {
          return next(new ErrorHandler("Product not found", 404));
        }
      
        const imgId = req.body.imgId;
      
        const isDeleted = await delete_file(imgId);
        if (isDeleted) {
          // Remove deleted image from product's images array
          product.images = product.images.filter((img) => img.public_id !== imgId);
          await product.save();
      
          res.status(200).json({
            success: true,
            product,
          });
        } else {
          return next(new ErrorHandler("Failed to delete image", 500));
        }
      });
      


//  Delete product  => api/v1/admin/products/id    //

// Delete product and associated images => api/v1/admin/products/:id
export const deleteProduct = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    
    const imageDeletionPromises = product.images.map((img) =>
      delete_file(img.public_id)
    );
  
    
    const results = await Promise.all(imageDeletionPromises);
  
    
    const failedDeletions = results.some((isDeleted) => !isDeleted);
    if (failedDeletions) {
      return next(new ErrorHandler("Failed to delete one or more images", 500));
    }
  
    await product.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  });
  

//  Create/Update Product Review  => api/v1/reviews   //

export const createProductReview = catchAsynErrors(async (req , res, next) => {
const {rating, comment, productId} = req.body;

const review = {
user: req?.user?._id,
rating: Number(rating),
comment,
}

const product = await Product.findById(productId);
if (!product){
return next(new ErrorHandler("Product not found", 404));
}
const isReviewed = product?.reviews?.find(
(r) => r.user.toString() === req?.user?._id.toString()    
);

if(isReviewed){
product.reviews.forEach((review) => {
if(review?.user?._id.toString() === req?.user?._id.toString()){
review.comment = comment,
review.rating = rating;
}
});
} else {
product.reviews.push(review);
product.NumOfReviews = product.reviews.length;
}

product.ratings = product.reviews.reduce((acc, item) => 
item.rating + acc, 0) / product.reviews.length;

await product.save({ validateBeforeSave: false});

res.status(200).json({ 
success:true,
});
});

 //  Get Product Reviews  => api/v1/reviews   //

 export const getProductReview = catchAsynErrors(async (req , res, next) => {
const product = await Product.findById(req.query.id).populate("reviews.user");

if (!product){
return next(new ErrorHandler("Product not found", 404));
}

res.status(200).json({
reviews: product.reviews,

});
});


//  Delete Product Review  => api/v1/admin/reviews   //

export const deleteReview = catchAsynErrors(async (req , res, next) => {
  
    let product = await Product.findById(req.query.productId);

    if (!product){
    return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()    
    );

    const NumOfReviews = reviews.length;

    const ratings = 
    NumOfReviews === 0
    ? 0
    : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    NumOfReviews;
    
    product = await Product.findByIdAndUpdate(
    req.query.productId,
    {reviews, NumOfReviews, ratings},
    {new: true}    
    );    
    
    res.status(200).json({ 
    success:true,
    });
    });


     //  Can User Review => api/v1/can_review    //

   /* export const canUserReview = catchAsynErrors(async (req , res) => {
    const orders = await Order.find({

        user: req.user._id,
        "orderItems.product": req.query.productId,
        
    });
    if(orders.length === 0 ) {
        return res.status(200).json({
            canReview : false,
        })
    }
      res.status(200).json({
        canReview : true,
      })
    }); */
                    















