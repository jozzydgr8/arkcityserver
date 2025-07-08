const router = require('express').Router();
const { getAllProducts, getSingleProduct, postProduct, updateProduct, deleteProduct } = require('../controller/productController');
const authenticator = require('../middleware/authenticator');
const multerUpload = require('../config/multerConfig');

router.get('/',  getAllProducts)
router.get('/:id', getSingleProduct)

router.post('/', authenticator, multerUpload.single('image'), postProduct)

router.patch('/:id',authenticator,multerUpload.single('image'), updateProduct)

router.delete('/:id',authenticator, deleteProduct)

module.exports=router;