const express=require('express');
const router=express.Router();
const {authMiddleware}=require('../middleware/middlewares');
const { Account } = require('../db/database');
const { default: mongoose } = require('mongoose');

router.use(express.json());


router.get('/balance',authMiddleware,async(req,res)=>{
    const accountDB=await Account.findOne({userId:req.userId});
    res.status(200).json({accountDB});
})

router.post('/transfer',authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    const {amount,to}=req.body;
    const account=await Account.findOne({userId:req.userId});
    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({message:'Insufficient balance'});
    }
    const toAccount=await Account.findOne({userId:to});
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({message:'Invalid account'});
    }
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    await session.commitTransaction();
    res.status(201).json("Transfer Successful");
})

// async function transfer(req){
//     const session=await mongoose.startSession();
//     session.startTransaction();
//     const {amount,to}=req.body;
//     const account=await Account.findOne({userId:req.userId});
//     console.log(account);
//     if(!account || account.balance<amount){
//         await session.abortTransaction();
//         console.log("Insufficient balance")
//         return;
//         // return res.status(400).json({message:'Insufficient balance'});
//     }
//     const toAccount=await Account.findOne({userId:to});
//     if(!toAccount){
//         await session.abortTransaction();
//         console.log("Invalid account")
//         return;
//         // return res.status(400).json({message:'Invalid account'});
//     }
//     await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
//     await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
//     await session.commitTransaction();
//     // res.status(201).json("Transfer Successful");
//     console.log("done");
// }

// transfer({
//     userId: "66acdaa02bfa4651dfcb95f8",
//     body: {
//         to: "66ad1f94e5f5d4b6831c21ff",
//         amount: 100
//     }
// })

// transfer({
//     userId: "66acdaa02bfa4651dfcb95f8",
//     body: {
//         to: "66ad1f94e5f5d4b6831c21ff",
//         amount: 100
//     }
// })

module.exports=router;