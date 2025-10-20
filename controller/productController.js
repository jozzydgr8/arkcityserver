const Product = require('../MongooseSchema/productSchema');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary')

//controller to get all product
const getAllProducts= async(req,res)=>{
    try{
        const data = await Product.find({});
        res.status(200).json(data);

    }catch(error){
        res.status(400).json({message:error.message})
    }
}

//get single product
const getSingleProduct = async (req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:'invalid request'})
    }
    try{
        const data = await Product.findById(id);
        if(!data){
            return res.status(404).json({message:'no such file'})
        }
        res.status(200).json(data)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

// controller to post and upload product with image
const postProduct = async (req, res) => {
  const { title, description, size, cost, category } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }


    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      title,
      description,
      size,
      cost,
      imagePath: result.secure_url,
      image_id:result.public_id,
      category
    });
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}

//controller to update product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'No such product' });
    }

   
    if (req.file) {
      await cloudinary.uploader.destroy(product.image_id);

      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.imagePath = result.secure_url;
      req.body.image_id = result.public_id;
    }


    const updatedProduct = await Product.findOneAndUpdate({_id:id}, req.body, { new: true });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
};

//controller to delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'No such product' });
    }


    await cloudinary.uploader.destroy(product.image_id);


    await product.deleteOne();

    res.status(200).json({ message: 'Product and image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports={getAllProducts, getSingleProduct, postProduct, updateProduct, deleteProduct}