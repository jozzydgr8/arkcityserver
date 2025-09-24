const axios = require('axios');
const Order = require('../MongooseSchema/OrderSchema');
const { default: mongoose } = require('mongoose');
const sendEmail = require('../config/mailer');


//get route
const getOrder = async(req,res)=>{
    try{
        const order = await Order.find({});
        res.status(200).json(order);
    }catch(error){
        res.status(400).json({error:error.message})
    }
    
}
//post route
const verifyAndPostOrder=async (req, res) => {

  const { reference } = req.body;

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.paystacksecretkey}`,
      },
    });

    const paymentData = response.data.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({ status: 'failed', message: "Payment not successful" });
    }

    // Check if already verified
    const existing = await Order.findOne({ reference });
    if (existing) {
      return res.status(200).json({ status: "already verified", data: existing });
    }

    // Extract fields from metadata
    const getMetadata = (key) => {
      return paymentData.metadata?.custom_fields?.find(f => f.variable_name === key)?.value || "";
    };

    const order = await Order.create({
      email: paymentData.customer.email.toLowerCase().trim(),
      reference: paymentData.reference,
      amount: paymentData.amount / 100,
      status: paymentData.status,
      name: getMetadata('name'),
      address: getMetadata('address'),
      phone: getMetadata('phone'),
      product:getMetadata('product'),
      category:getMetadata('category'),
      notes:getMetadata('notes')
    });
    const emailBody = {
      recipient_email: paymentData.customer.email,
      subject:`Order Succesful`,
      message:`Your order has been succesfully received with orderId:${order._id}`
    }
    const send = await sendEmail(emailBody);
    res.status(200).json({ status: 'success', data: order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Verification failed" });
  }finally{
    
  }
}
const updateOrder = async (req,res)=>{
  const{orderStatus}=req.body;
  const{id}=req.params;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({error:'invalid request'})
  }
  try{
    const data = await Order.findOneAndUpdate({_id:id},{orderStatus:orderStatus}, { new: true });
    if(!data){
      return res.status(400).json({error:'no such data'})
    }
    res.status(200).json(data)
  }catch(error){
    res.status(400).json(error)
  }

}




module.exports = {getOrder, verifyAndPostOrder,updateOrder}