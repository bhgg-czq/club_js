const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId



//创建schema
const studentSchema =new Schema({
    id:{type:ObjectId},
    stuid:{unique:true,type:String},
    password:{type:String},
    stuname:{type:String},
    phone:{type:String},
    image:{type:String},
    collegename:{type:String}
})

mongoose.model('Student',studentSchema)
