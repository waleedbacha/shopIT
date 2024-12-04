import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

name: {
type: String,
required: [true, "Please enter product name"],
maxLength: [200, "product length not be exceeded"],
},

price:
{
    type: Number,
    required: [true, "please enter product price"],
    maxLength: [5, "product price cannot excced 5 digits"],
},

description: 
{
type: String,
required: [true, "please enter the product description"],
},

ratings: 
{
    type:Number,
    default:0,
},

images: [
{
 public_id:{
type:String,
required:true,
 },
 public_url:{
    type:String,
    required:true,
 }, 
},
],

categories: {
type: String,
required: [true, "please enter product category"],
enum: {
values: [
"Electronics",
"Accessories",
"Mobiles",
"Laptops",
"Fruits",
"Winter Shoes",
"Cameras",
"Home products",
"Fregnances",

], 
message: "please select correct category",
},
},

seller: {
    type: String,
    required: [true, "please enter product seller"],
},
 stock: {
type: Number,
required: [true, "Please enter product in stock"],    
 },

 NumOfReviews: {
type: Number,
default: 0,
 },
reviews: [
{
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},

rating:{
type:Number,
required:true,
},
comment:{
type:String,
required:true,
},
},
],
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
},

}, {timestamps:true},

);

export default mongoose.model("Product", productSchema);