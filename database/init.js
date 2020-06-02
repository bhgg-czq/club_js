const mongoose=require('mongoose')
const db="mongodb://czq:12345@localhost/club"
const glob=require('glob')
const {resolve} =require('path') //相对路径转换为绝对路径

exports.initSchemas=()=>{
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}

exports.connect=()=>{
    mongoose.connect(db,{useNewUrlParser: true})
    let maxConnection=0
    return new Promise((resolve,reject)=>{
        mongoose.connection.on('disconnected',()=>{
            console.log('数据库断开')
            if(maxConnection<=3){
                mongoose.connect(db,{useNewUrlParser: true})
                maxConnection++;
            }
            else{
                reject()
                throw new Error ('数据库出现问题，请人为处理');
            }
        })
    
        mongoose.connection.on('error',(err)=>{
            console.log('数据库错误')
            if(maxConnection<=3){
                mongoose.connect(db,{useNewUrlParser: true})
                maxConnection++;
            }
            else{
                reject(err)
                throw new Error ('数据库出现问题，请人为处理');
            }
        })
    
        mongoose.connection.once('open',()=>{
            console.log('connected successful')
            resolve()
        })
    })
  
}