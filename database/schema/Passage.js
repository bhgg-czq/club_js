const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId

const PassageSchema =new Schema({
    id:{type:ObjectId},
    cid:{type:Number},
    name:{type:String},
    content:{type:String},
    image:{type:String},
    time:{type:Date},
    url:{type:String}
})

mongoose.model('Passage',PassageSchema)