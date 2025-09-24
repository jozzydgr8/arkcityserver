const router = require('express').Router();
const Subscribe = require('../MongooseSchema/SubscribeSchema');
const validator = require('validator');
const sendEmail = require('../config/mailer');

const authenticator = require('../middleware/authenticator')

router.get('/', authenticator, async(req,res)=>{
    try{
        const data = await Subscribe.find({});
        res.status(200).json(data);
    }catch(error){
        res.status(400).json({error:error})
    }
});

router.post('/', async(req,res)=>{
    const email = req.body.email.toLowerCase().trim();
    if(!validator.isEmail(email)){
        return res.status(400).json({error:"invalid email"})
    }
    try{
       const exist = await Subscribe.findOne({email:email});
       if(exist){
        return res.status(400).json({error:'email already subscribed'})
       }
       const data =await Subscribe.create({email:email});
       const emailbody = {
        recipient_email:email,
        subject:`Thanks for subscribing!`,
        message:`<p>Hi there,</p>

                <p>Thanks for subscribing to our newsletter! 🎉</p>

                <p>You’ll now receive:</p>
                <ul>
                <li>📢 The latest news and updates</li>
                <li>📝 Exclusive content and tips</li>
                <li>🎁 Special offers and early access</li>
                </ul>

                <p>We’re excited to have you with us. Stay tuned for great things ahead!</p>

                <p>If you ever have questions or feedback, just reply to this email — we’d love to hear from you.</p>

                <p>Welcome aboard!<br />
                — The <strong>ArkCity</strong> Team</p>`
       }
       const send = await sendEmail(emailbody);
       res.status(200).json({message:'success'});
    }catch(error){
        res.status(400).json({error:error})
    }
})

module.exports=router