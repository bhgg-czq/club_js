const mongoose=require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId

const MemberTableScheme=new Schema({
    id:{type:ObjectId},
    clubid:{type:Number},
    stuid:{type:String},
    type:{type:String},
    joinDate:{type:Date},
    leaveDate:{type:Date},
    state:{type:Number}
})

mongoose.model('MemberTable',MemberTableScheme)