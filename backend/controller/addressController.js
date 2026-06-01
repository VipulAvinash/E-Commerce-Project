import Address from "../models/Address.js";

// Save Address
export const saveAddress = async(req,res)=>{
    try {
        // Automatically attach req.userId if available from protect middleware
        const addressData = { ...req.body, userId: req.userId || req.body.userId };
        const address = await Address.create(addressData)
        res.json(address)
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
}

//Get Address By UserID 

export const getAddresses = async(req , res)=>{
    try{
        const addresses = await Address.find({userId : req.params.userId})
        res.json(addresses)
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
}


