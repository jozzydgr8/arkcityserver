const router = require('express').Router();
const Refill = require('../MongooseSchema/RefillSchema');
const Daily = require('../MongooseSchema/ReadingsSchema');
const authenticator = require('../middleware/authenticator')

router.get('/',async(req,res)=>{
    try{
    const refillData = await Refill.find({}).lean();
    const dailyData = await Daily.find({}).lean(); 
    const combined =[
        ...dailyData.map(item=>({
            id:item._id,
            date:item.createdAt,
            type:"sale",
            unitSold:item.dailyReading,
            amountAdded:null,
            balanceAfter:item.balance
        })),
        ...refillData.map(item=>({
            id:item._id,
            date:item.createdAt,
            type:"refill",
            unitSold:null,
            amountAdded:item.amountAdded,
            balanceAfter:item.balance
        }))
    ];
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json(combined)
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
module.exports = router;