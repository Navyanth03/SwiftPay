const mongoose=require('mongoose');
const { number, string } = require('zod');

const userSchema=mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      mexLength: 30  
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength:6
    }
})

const accountSchema=mongoose.Schema({
    balance: {
        type: Number,
        required: true
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
})

const User=mongoose.model('users',userSchema);
const Account=mongoose.model('accounts',accountSchema);

function connectDB(url){
    return mongoose.connect(url);
}

module.exports={
    User,
    Account,
    connectDB
}
