const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId

const TimetableSchema=new Schema({
    id:{type:ObjectId},
    aId:{type:String},
    rId:{type:String},
    startTime:{type:Date},
    endTime:{type:Date},
    state:{type:Number},
    reason:{type:String},
})
mongoose.model('Timetable',TimetableSchema)
