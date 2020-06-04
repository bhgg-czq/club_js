const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId


const ClassroomSchema =new Schema({
    id:{type:ObjectId},
    roomid:{type:String},
    name:{type:String},
    ohp:{type:Boolean},
    capacity:{type:Boolean},
    adminId:{type:String},
})

mongoose.model('Classroom',ClassroomSchema)
