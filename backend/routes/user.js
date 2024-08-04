const express=require('express');
const router=express.Router();
const zod=require('zod');
const jwt=require('jsonwebtoken');
const { User, Account } = require('../db/database');
const JWT_PASSWORD=require('../config');
const {authMiddleware} = require('../middleware/middlewares');

const signup=zod.object({
    firstName:zod.string(),
    lastName:zod.string(),
    email:zod.string().email(),
    password:zod.string().min(6)
})

router.use(express.json());

router.post('/signup',async(req,res)=>{
    const zodObject=signup.safeParse(req.body);
    if(!zodObject.success)return res.status(411).json("Email already taken / Incorrect inputs");
    const userExists=await User.findOne({email: zodObject.data.email});
    if(userExists)return res.status(411).json("Email already taken / Incorrect inputs");
    try {
        const userDB=await User.create(zodObject.data);
        const token=jwt.sign({userId:userDB._id},JWT_PASSWORD);
        const accountDB=await Account.create({balance:500000,userId:userDB._id});
        return res.status(201).json({message:"User created successfully",token,balance:accountDB.balance});
    } catch (error) {
        return res.status(411).json("Email already taken / Incorrect inputs");
    }
})

const signin=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})

router.post('/signin',async(req,res)=>{
    const zodObject=signin.safeParse(req.body);
    if(!zodObject.success)return res.status(411).json('send valid credentials');
    const userDB=await User.findOne(req.body);
    if(!userDB)res.status(411).json({message: "Error while logging in"});
    const token=jwt.sign({userId:userDB._id},JWT_PASSWORD);
    res.status(201).json({token});
})

const update=zod.object({
    firstName:zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().min(6).optional()
})

router.put('/update',authMiddleware,async(req,res)=>{
    const {firstName,lastName,password}=req.body;
    const zodObject=update.safeParse({firstName,lastName,password});
    if(!zodObject.success)return res.status(411).json("wrong update data");
    try {
        await User.updateOne({_id:req.userId},req.body);
        const updatedUserDB=await User.find({_id:req.userId});
        res.status(201).json({user:updatedUserDB});  
    } catch (error) {
        res.status(411).json(error);
    }
})

router.get('/bulk',authMiddleware,async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await User.find({
        $or:[{firstName:{$regex:filter}},{lastName:{$regex:filter}}]
    })
    res.status(200).json({user:users.map(user=>({
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email
    }))});
})

module.exports=router;