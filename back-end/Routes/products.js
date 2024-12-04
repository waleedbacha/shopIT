import express from "express";
import {  createProductReview, deleteProduct, deleteProductImage, deleteReview, getAdminProducts, getProductDetails, getProductReview, getproducts, newProduct, updateProduct, uploadProductImage } from "../Controller/producControllers.js";
import isAuthenticatedUser, {  authorizeRoles }  from "../middlewares/auth.js"
const router = express.Router();

router.route('/products').get(getproducts);

router.route
('/admin/products')
.post(isAuthenticatedUser, authorizeRoles("admin"),newProduct)
.get(isAuthenticatedUser, authorizeRoles("admin"),getAdminProducts);


router.route('/products/:id').get(getProductDetails);

router.route('/admin/products/:id').put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct);

router.route('/admin/products/:id').delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);

router.route
('/admin/products/:id/upload_images')
.put(isAuthenticatedUser, authorizeRoles("admin"),uploadProductImage)

router.route
('/admin/products/:id/delete_image')
.put(isAuthenticatedUser, authorizeRoles("admin"),deleteProductImage)

router.route('/reviews')
.put(isAuthenticatedUser, createProductReview)
.get(isAuthenticatedUser, getProductReview);

router.route('/admin/reviews')
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

// router.route('/can_review').get(isAuthenticatedUser, canUserReview); //



export default router;