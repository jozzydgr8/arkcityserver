const Total = require('../MongooseSchema/TotalUnitSchema');

const addTotal = async(req,res)=>{
    const {totalUnit} = req.body;
    if (typeof totalUnit !== 'number') {
    return res.status(400).json({ error: "Invalid total unit value" });
}
    try{
        const TotalCreated = await Total.findOne({});
        if(TotalCreated){
            return res.status(400).json({error:"Total unit has been previously set"});
        }
        const createTotal = await Total.create({currentBalance:totalUnit});
        res.status(200).json(createTotal);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

const getTotal = async(req,res)=>{
    try{
        const getTotal = await Total.find({});
        res.status(200).json(getTotal);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

const updateTotal = async (req, res) => {
    const { currentBalance } = req.body;

    if (typeof currentBalance !== 'number' || currentBalance < 0) {
        return res.status(400).json({ error: "Invalid balance value" });
    }

    try {
        const existingTotal = await Total.findOne({});
        if (!existingTotal) {
            return res.status(404).json({ error: "Total unit has not been set yet" });
        }

        const updatedTotal = await Total.findByIdAndUpdate(
            existingTotal._id,
            { currentBalance },
            { new: true }
        );

        res.status(200).json({
            message: "Current balance updated successfully",
            updatedBalance: updatedTotal.currentBalance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {addTotal, getTotal, updateTotal}