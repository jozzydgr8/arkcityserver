const Refill = require('../MongooseSchema/RefillSchema');
const Total = require('../MongooseSchema/TotalUnitSchema');

const getRefill = async(req,res)=>{
    try{
        const getDoc = await Refill.find({});
        res.status(200).json(getDoc);
    }catch(error){
        res.status(400).json({error:error})
    }
}

const addRefill = async (req,res)=>{
    const {refill} = req.body;
    if (typeof refill !== 'number' || refill < 0) {
    return res.status(400).json({ error: "Invalid total unit value" });
    }
    try{
        const getCurrentTotal = await Total.findOne({});
            if(!getCurrentTotal){
              return res.status(400).json({error:'Total Balance has not been set'});
            }
            const newBalance = getCurrentTotal.currentBalance + refill;
            const addRefill = await Refill.create({amountAdded:refill,balance:newBalance});

            const newTotalBalance = await Total.findOneAndUpdate({_id:getCurrentTotal._id},{
              currentBalance:newBalance
            },{ new: true })
        
        res.status(200).json({refill:addRefill, balance:newTotalBalance})
    }catch(error){
        res.status(500).json({error:error.message})
    }

}

const deleteRefill = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Get the refill entry to be deleted
        const refillToDelete = await Refill.findById(id);

        if (!refillToDelete) {
            return res.status(404).json({ error: "Refill record not found" });
        }

        // Step 2: Get the current total balance
        const currentTotal = await Total.findOne({});
        if (!currentTotal) {
            return res.status(400).json({ error: 'Total Balance has not been set' });
        }

        // Step 3: Calculate the new balance
        const updatedBalance = currentTotal.currentBalance - refillToDelete.amountAdded;

        if (updatedBalance < 0) {
            return res.status(400).json({ error: 'Deleting this refill would result in a negative balance' });
        }

        // Step 4: Delete the refill by ID
        await Refill.findByIdAndDelete(id);

        // Step 5: Update the total balance
        const updatedTotal = await Total.findByIdAndUpdate(
            currentTotal._id,
            { currentBalance: updatedBalance },
            { new: true }
        );

        // Step 6: Respond
        res.status(200).json({
            message: "Refill deleted successfully",
            deletedRefill: {
                _id: refillToDelete._id,
                amountAdded: refillToDelete.amountAdded,
                balance: refillToDelete.balance
            },
            updatedBalance: updatedTotal.currentBalance
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports ={addRefill, getRefill, deleteRefill}