const mongoose = require('mongoose')
const Schema=mongoose.Schema
let ObjectId =Schema.Types.ObjectId
const bcrypt =require('bcrypt')
const SALT_WORK_FACTOR=10//加盐的数量
//创建schema
const userSchema =new Schema({
    id:{type:ObjectId},
    userid:{unique:true,type:String},
    password:{type:String},
    type:{type:String}
})

//每次保存的操作
//通过bcrypt 对密码进行加盐加密
// userSchema.pre('save', function(next){
//     bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt)=>{
//         if(err) return next(err)
//         bcrypt.hash(this.password,salt,(err,hash)=>{
//             if(err) return next(err)
//             this.password = hash
//             next()
//         })
//     })
// })

// userSchema.methods={
//     comparePassword:(_password,password)=>{
//         return new Promise((resolve,reject)=>{
//             bcrypt.compare(_password,password,(err,isMatch)=>{
//                 if(!err) resolve(isMatch)
//                 else reject(err)
//             })
//         })
//     }
// }

mongoose.model('Admin',userSchema)