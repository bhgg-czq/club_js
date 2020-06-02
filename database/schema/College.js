const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId



//创建schema
const CollegeSchema =new Schema({
    _id:{type:Number},
    name:{type:String},
    admin_id:{type:Number}
})

mongoose.model('College',CollegeSchema)
