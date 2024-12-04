import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async() => {

try{

await mongoose.connect("mongodb://localhost:27017/shopIT");

await Product.deleteMany();
console.log("products are deleted");

await Product.insertMany(products);
console.log("products are inserted");

process.exit();
}
catch(error) {
    console.log(error.message);
    process.exit();
}
}
seedProducts();