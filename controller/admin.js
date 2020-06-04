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

//查找活动
router.get('/waittopassa',async(ctx)=>{
    let aid=ctx.query.aid
    let pass
    if(ctx.query.index==="0")
        pass=false
    else 
        pass=true
    console.log(ctx.query.index+pass)
    console.log(ctx.query)
    console.log(aid)
    const club=mongoose.model('Club')
    const activity=mongoose.model('Activity')
    // let clubs=new club()
    // clubs.name='校学生会',
    // clubs.cId="A111"
    // clubs.logo='',
    // clubs.description='无',
    // clubs.bookNum=39,
    // clubs.level=2,
    // clubs.mainActivity="无",
    // clubs.college="校级",
    // clubs.adminId="J789"
    // clubs.save();
//     let a=new activity()
//     a.name="校学生会招新活动"
//     a.cId="A111"
//     a.apply_date="2020-3-10"
//     a.start_time="2020-7-1"
//     a.end_time="2020-7-10"
//     a.number=100
//     a.budget=500
//     a.detail="这是一个活动，将在这天举行什么fdsfdsfdsf巴拉巴拉"
//     a.image=""
//     a.limited="1"
//     a.a_pass=false
//     a.b_pass=false
//      a.save()
   let activities=new Array();
   let cid
    await club.find({adminId:aid}).exec().then(async(res)=>{
        console.log(res)
        
        for(let a=0;a<res.length;a++){
            cid=res[a].cId
            console.log(cid)
            await activity.aggregate([
                {
                    $match:{
                            "a_pass":pass,
                            "cId":cid
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
                // {
                //     $project:{stuid:1,joinDate:1}
                // },
            ],
              ).then(async(result)=>{
                  console.log(result+"result")
                  if(result){
                    if(a===0){
                        activities=result
                    }
                    else{
                        for(let i in result){

                            　　activities.push(result[i])
                            
                            }
                        
                    }
                  }
                    
              }).catch(err=>{
                  ctx.body={code:500,message:err}
              })
        }
        ctx.body={activities:activities}
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


module.exports =router