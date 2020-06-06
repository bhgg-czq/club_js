const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()
router.get('/',async(ctx)=>{
    ctx.body="这是用户操作首页"
})


router.post('/login',async(ctx)=>{
    let loginUser = ctx.request.body
    console.log(loginUser)
    let userid = loginUser.userid
    let password = loginUser.password

    
    //引入User的model
    const Admin = mongoose.model('Admin')

    await Admin.findOne({userid:userid}).exec().then(async(result)=>{
        console.log(result)
        if(result){
            let newAdmin = new Admin()
            if(password==result.password)
            // await newAdmin.comparePassword(password,result.password)
            // .then(isMatch=>{
                ctx.body={code:200,message:"登陆成功"}
          //  })
            // .catch(error=>{
                else{
                console.log("出错")
                ctx.body={code:500,message:"密码错误,登陆失败"}
                }
         //   })
        }else{
            ctx.body={code:500,message:'用户名不存在'}
        }
    }).catch(error=>{
        console.log(error)
        ctx.body={code:500,message:error}
    })

})

activitiesDetail=function(pass){
   
}

//查找未审核的活动
router.get('/waittopassa',async(ctx)=>{
    let aid=ctx.query.aid
    // console.log(ctx.query.index+pass)
    console.log(ctx.query)
    console.log(aid)
    const activity=mongoose.model('Activity')
    let result=[]
             await activity.aggregate([
                {
                    $match:{
                            "a_pass":null
                            }
               },
                {
                    $lookup:{
                        from:"clubs",
                        localField:"cId",
                        foreignField:"cId",
                        as:"items"
                    }
                },
                {
                    $match:{
                        "clubs.adminId":aid
                    }
                }
            ]).then(async(res)=>{
    
        ctx.body={code:200,activities:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//查找已审核的活动
router.get('/alreadypassa',async(ctx)=>{
    let aid=ctx.query.aid
    console.log(ctx.query)
    console.log(aid)
    const activity=mongoose.model('Activity')
    let result=[]
             await activity.aggregate([
                {
                    $match:{
                            "a_pass":{"$ne":null }
                            }
               },
                {
                    $lookup:{
                        from:"clubs",
                        localField:"cId",
                        foreignField:"cId",
                        as:"items"
                    }
                },
                {
                    $match:{
                        "clubs.adminId":aid
                    }
                }
            ]).then(res=>{
    
        ctx.body={code:200,activities:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})


router.post('/passactivity',async(ctx)=>{
    let content=ctx.request.body
    const activity=mongoose.model('Activity')
    await activity.updateOne({_id:content.activity_id},{a_pass:1}).exec().then(async(res)=>{
        ctx.body={code:200,message:"审核通过成功"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.post('/cancelactivity',async(ctx)=>{
    let content=ctx.request.body
    const activity=mongoose.model('Activity')
    await activity.updateOne({_id:content.activity_id},{a_pass:0}).exec().then(async(res)=>{
        ctx.body={code:200,message:"审核不通过"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//查找未审核的地点
router.get('/waittopassb',async(ctx)=>{
    let aid=ctx.query.aid
    console.log(ctx.query)
    console.log(aid)
    const timetable=mongoose.model('Timetable')
    const club=mongoose.model('Club')
             await timetable.aggregate([
                {
                    $match:{
                            "state":null
                            }
               },
                {
                    $lookup:{
                        from:"activities",
                        localField:"aId",
                        foreignField:"_id",
                        as:"activity"
                    }
                },
                {
                    $lookup:{
                        from:"classrooms",
                        localField:"rId",
                        foreignField:"roomid",
                        as:"classroom"
                    }
                },
                { 
                    $match : {
                        "classroom.adminId" :aid
                    } 
                }
            ]).then(async(res)=>{
                for(let i=0;i<res.length;i++){
                    await club.findOne({cId:res[i].activity[0].cId}).exec().then(async(result)=>{
                        if(result){
                            res[i].college=result.college
                            res[i].clubname=result.name
                        }
                      
                    })
                }
        ctx.body={code:200,activities:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//查找已经审核的地点
router.get('/alreadypassb',async(ctx)=>{
    let aid=ctx.query.aid
    console.log(ctx.query)
    console.log(aid)
    const timetable=mongoose.model('Timetable')
    const club=mongoose.model('Club')
             await timetable.aggregate([
                {
                    $match:{
                            "state":{"$ne":null}
                            }
               },
                {
                    $lookup:{
                        from:"activities",
                        localField:"aId",
                        foreignField:"_id",
                        as:"activity"
                    }
                },
                {
                    $lookup:{
                        from:"classrooms",
                        localField:"rId",
                        foreignField:"roomid",
                        as:"classroom"
                    }
                },
                { 
                    $match : {
                        "classroom.adminId" :aid
                    } 
                }
            ]).then(async(res)=>{
                for(let i=0;i<res.length;i++){
                    await club.findOne({cId:res[i].activity[0].cId}).exec().then(async(result)=>{
                        if(result){
                            res[i].college=result.college
                            res[i].clubname=result.name
                        }
                      
                    })
                }
        ctx.body={code:200,activities:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//审核通过场地
 router.get('/classroom/pass',async(ctx)=>{
    let tid=ctx.query.tid
    let aid=ctx.query.aid
    const timetable=mongoose.model('Timetable')
    const activity=mongoose.model('Activity')
    await timetable.updateOne({_id:tid},{state:1}).exec().then(async(res)=>{
        await activity.updateOne({_id:aid},{b_pass:1}).exec().then(async(result)=>{
            ctx.body={code:200,message:"审核通过"}
        }).catch(err=>{
            ctx.body={code:500,message:err}
        })
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })

    
})

//审核不通过场地
router.get('/classroom/unpass',async(ctx)=>{
    let tid=ctx.query.tid
    let reason=ctx.query.reason
    const timetable=mongoose.model('Timetable')
    await timetable.updateOne({_id:tid},{state:0,reason:reason}).exec().then(async(res)=>{
        ctx.body={code:200,message:"审核不通过"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })

    
})


module.exports =router