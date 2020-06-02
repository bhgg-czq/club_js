const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId



//创建schema
const ClubSchema =new Schema({
    id:{type:ObjectId},
    cId:{type:String},
    name:{type:String},
    logo:{type:String},
    description:{type:String},
    bookNum:{type:Number},
    level:{type:Number},
    mainActivity:{type:String},
    college:{type:String},
    adminId:{type:String}
})

mongoose.model('Club',ClubSchema)
