const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId



//创建schema
const ActivitySchema =new Schema({
    id:{type:ObjectId},
    name:{type:String},
    cId:{type:String},
    apply_date:{type:Date},
    start_time:{type:Date},
    end_time:{type:Date},
    number:{type:Number},
    budget:{type:Number},
    detail:{type:String},
    image:{type:String},
    limited:{type:Number},
    a_pass:{type:Boolean},
    b_pass:{type:Boolean},
    cName:{type:String}

})

mongoose.model('Activity',ActivitySchema)
