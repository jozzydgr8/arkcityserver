const router = require('express').Router();
const multerUpload = require('../config/multerConfig');
const cloudinary = require('../config/cloudinary');
const Product = require('../MongooseSchema/productSchema');


router.post('/single', multerUpload.single('image'), async (req, res) => {
  const { title, description, size, cost } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save to MongoDB
    const product = await Product.create({
      title,
      description,
      size,
      cost,
      imagePath: result.secure_url,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});


router.post('/multiple', multerUpload.array('images', 3), async (req, res) => {
    const {title, description, cost, size} = req.body;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path)
        );

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(r => r.secure_url);
        const data = await Product.create({title, cost, size, description, imagePath:imageUrls});
        res.status(200).json(data);
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});


module.exports=router;