const User = require('../MongooseSchema/UserSchema');
const jwt = require('jsonwebtoken')
const genToken = (_id)=>{
    return jwt.sign({_id}, process.env.JWTSECRET, {expiresIn:"3d"});
}

const createUser = async(req,res)=>{
     const email = req.body.email.toLowerCase().trim();
     const createdBy = req.user.email.toLowerCase().trim(); 
    const password = process.env.defaultpassword;
    try{
        const user = await User.createUser({email, password,createdBy});
        const token = genToken(user._id)
        res.status(200).json({email, token});

    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//signuser
const signUser =async(req,res)=>{
     const email = req.body.email.toLowerCase().trim();
    const {password} = req.body;
    try{
        const user = await User.signUser({email,password});
        const token = genToken(user._id);
        res.status(200).json({email:user.email, token});
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//makeadmin
const makeAdmin = async(req,res)=>{
     const email = req.body.email.toLowerCase().trim();
    try{
        const user = await User.findOneAndUpdate({email:email}, {admin:true},{new:true});
        const token = genToken(user._id);
        res.status(200).json({email:user.email, token, admin:user.admin});
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//deleteadmin
const deleteAdmin = async(req,res)=>{
     const email = req.body.email.toLowerCase().trim();
    try{
        const isSuper = await User.findOne({email:email});
        if(!isSuper){
          return res.status(404).json({error:'not exist'})
        }
        if(isSuper.superadmin){
          return res.status(400).json({error:'not allowed'})
        }
        

        const user = await User.findOneAndDelete({email:email});
        const token = genToken(user._id);
        res.status(200).json({email:user.email, token, admin:user.admin});
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//gectUsers
const getUsers = async(req,res)=>{
    try{
        const user = await User.find({}).select('-_id email admin');
    
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//forgotpassword
const forgotAndResetPassword = async (req, res) => {
  const email = req.body.email.toLowerCase().trim();
  try {
    const result = await User.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

//change or updatepassword
const changePassword =  async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
  const { newPassword, password } = req.body;

  try {
    const user = await User.findOne({ email});

    if (!user) {
      throw Error('Invalid or expired token');
    }
    
   const userupdate = User.changePassword({email, password, newPassword})

    res.status(200).json({ message: 'Password has been reset successfully' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateAfterResetPassword = async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ email},{resetToken:token});

    if (!user) {
     return res.status(400).json({error:'Invalid or expired token'});
    }
    if(user.resetTokenExpires < Date.now()){
       return res.status(400).json({error:'expired token'});
    }

    // Update password
   const userreset = User.resetPassword({email, newPassword})

    res.status(200).json({ message: 'Password has been reset successfully' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports ={createUser, 
    signUser,makeAdmin, 
    deleteAdmin, getUsers, 
    forgotAndResetPassword, changePassword, 
    updateAfterResetPassword}