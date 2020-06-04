const Router = require('koa-router')
const mongoose = require('mongoose')

let router = new Router()
router.get('/',async(ctx)=>{
    ctx.body="这是社长操作"
})

//登陆
router.post('/login',async(ctx)=>{
    let loginleader=ctx.request.body
    console.log(loginleader)
    let stuid = loginleader.id
    let password = loginleader.password
    const mTable=mongoose.model('MemberTable')
    const leader=mongoose.model('Student')


    await leader.findOne({stuid:stuid}).exec().then(async(result)=>{
        console.log(result)
        if(result){
            await mTable.findOne({stuid:stuid}).exec().then(async(member)=>{
                console.log(member)
                let a=(member&&(member.type=='leader'))
                if(a){
                    if(result.password==password){
                        ctx.body={code:200,message:'登陆成功',cId:member.clubid}
                    }
                    else{
                        ctx.body={code:400,message:'密码错误，请重试'}
                    }
                }else{
                    ctx.body={code:400,message:'没有管理员权限'}
                }
            })
        }
        else{
            ctx.body={code:400,message:'用户名不存在'}
        }
    })
    .catch(error=>{
        console.log(error)
        ctx.body={code:500,message:error}
    })
})

//成员管理
router.post('/findAll',async(ctx)=>{
    let content=ctx.request.body
    const mTable=mongoose.model('MemberTable')
    console.log(content)
   await mTable.aggregate([
        {
            $lookup:{
                from:"students",
                localField:"stuid",
                foreignField:"stuid",
                as:"items"
            }
        },
        // {
        //     $project:{stuid:1,joinDate:1}
        // },
        {
            $match:{
                    "clubid":content.cid,
                    "state":Number(content.state),
                    "type":"member"
                    }
        }
    ],
    // function(err,docs){
    //     console.log(JSON.stringify(docs));
    //     ctx.body=docs
      ).then(async(result)=>{
        ctx.body=result
      })
})

router.post('/addMember',async(ctx)=>{
    let content=ctx.request.body
    const mTable=mongoose.model('MemberTable')
    const student=mongoose.model('Student')
    let stuid=content.stuid
    let cid=content.cid
    console.log(cid+stuid)
    await student.findOne({stuid:stuid}).exec().then(async(res)=>{
        console.log("kkkk")
        if(res){
            console.log("fdf")
         await mTable.findOne({stuid:stuid,clubid:cid}).exec().then(async(result)=>{
            if(result){
                ctx.body={code:400,message:"该学生已加入社团"}
                
            }else{
                console.log(res)
                let newmember=new mTable()
                newmember.stuid=stuid
                newmember.clubid=cid
                newmember.type="member"
                newmember.joinDate=Date.parse(new Date())
                newmember.leaveDate=""
                newmember.state=1
                console.log(newmember)
               newmember.save()
               ctx.body={code:200,message:"添加成功"}
            }
        })
        }
        else{
            ctx.body={code:400,message:"该学生不存在"}
        }
    }).catch(error=>{
        console.log(error)
        ctx.body={code:500,message:error}
    })

})
router.post('/updateMember',async(ctx)=>{

})

router.post('/deleteMember',async(ctx)=>{
    let content=ctx.request.body;
    console.log(content)
    const mTable=mongoose.model('MemberTable')
    await mTable.updateOne({'stuid':content.stuid,'clubid':Number(content.cid)},{'state':0,'leaveDate':new Date()
    }).then(async()=>{
        ctx.body={
            code:200,
            message:'删除成功'
        }
    }).catch(error=>{
        ctx.body={
            code:500,
            message:error
        }
    })
})

//推送
router.get('/passageAll',async(ctx)=>{
    let cid=ctx.query.cid
    console.log(ctx.query)
    console.log(cid)
    const passage=mongoose.model('Passage')
    await passage.find({'cid':cid}).exec().then(async(res)=>{
        ctx.body={code:200,passages:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.post('/addPassage',async(ctx)=>{
    const passage=mongoose.model('Passage')
    let newpassage=new passage()
    let content=ctx.request.body
    console.log(content)
    newpassage.cid=content.cid
    newpassage.name=content.name
    newpassage.content=content.content
    newpassage.image=content.image
    newpassage.time=new Date()
    newpassage.url=content.url
    await newpassage.save().then(async()=>{
        ctx.body={code:200,message:"发布成功"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.get('/deletePassage',async(ctx)=>{
    let pid=ctx.query.pid
    console.log(ctx.query)
    console.log(pid)
    const passage=mongoose.model('Passage')
    await passage.deleteOne({'_id':pid}).exec().then(async(res)=>{
        ctx.body={code:200,message:'删除成功'}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.get('/searchPassage',async(ctx)=>{
    let cid=ctx.query.cid
    let keyword=ctx.query.keyStr
    console.log(ctx.query)
    const reg=new RegExp(keyword);
    const passage=mongoose.model('Passage')
    await passage.find().and([
        {
            "$or":[
                 {"name":{ $regex: reg}},
                 {"content":{ $regex:reg}}
                ]
        },
        {cid:cid}
    ])
        .sort({time:1}).exec().then(async(res)=>{
        if(res){
            ctx.body={code:200,message:'查询成功',passages:res}
        }
        else
            ctx.body={code:400,message:"查询到数据为0条"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//场地-----------------------------------------------------------------------------------------------

router.get('/listAllRoom',async(ctx)=>{
    const classroom=mongoose.model('Classroom')
    // let c=new classroom()
    // c.roomid="1"
    // c.name="风雨操场"
    // c.ohp=false
    // c.capacity=false
    // c.adminId="c123"
    // c.save()

    // let d=new classroom()
    // d.roomid="2"
    // d.name="图信"
    // d.ohp=true
    // d.capacity=true
    // d.adminId="c456"
    // d.save()
    await classroom.find().exec().then(async(res)=>{
        ctx.body={code:200,roomlist:res}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
    
})

router.get('/classroom/getunPass',async(ctx)=>{
    let aid=ctx.query.aid
    console.log(aid)
    const timetable=mongoose.model('Timetable')
    // let c=new timetable()
    // c.aId="5ed490850a2e722678055b10"
    // c.rId="1"
    // c.startTime="2020-06-30 13:00"
    // c.endTime="2020-06-30 17:00"
    // c.state=""
    // c.reason=""
    // c.save()

    await timetable.aggregate([
        {
            $match:{
                   "aId":aid,
                   "state":0
                    }
       },
        {
            $lookup:{
                from:"classrooms",
                localField:"rId",
                foreignField:"roomid",
                as:"items"
            }
        },
    ]).then(async(res)=>{
        if(res){
            console.log(res)
            ctx.body={code:200,activities:res}
        }
    })
    .catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.get('/classroom/waitPass',async(ctx)=>{
    let aid=ctx.query.aid
    console.log(aid)
    const timetable=mongoose.model('Timetable')
    await timetable.aggregate([
        {
            $match:{
                   "aId":aid,
                   "state":null
                    }
       },
        {
            $lookup:{
                from:"classrooms",
                localField:"rId",
                foreignField:"roomid",
                as:"items"
            }
        },
    ]).then(async(res)=>{
        if(res){
            console.log(res)
            ctx.body={code:200,activities:res}
        }
    })
    .catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.get('/classroom/getPass',async(ctx)=>{
    const timetable=mongoose.model('Timetable')

    await timetable.aggregate([
        {
            $match:{
                    $or:[
                        {"state":null},
                        {"state":1}
                    ]
                    }
       },
        {
            $lookup:{
                from:"classrooms",
                localField:"rId",
                foreignField:"roomid",
                as:"items"
            }
        },
    ]).then(async(res)=>{
        if(res){
            console.log(res)
            ctx.body={code:200,activities:res}
        }
    })
    .catch(err=>{
        ctx.body={code:500,message:err}
    })
})

router.post('/activity/checkroom',async(ctx)=>{
    let content=ctx.request.body
    console.log(content)
    const timetable=mongoose.model('Timetable')
    let table=new timetable()
    table.aId=content.aId
    table.rId=content.rId
    table.startTime=content.startTime
    table.endTime=content.endTime
    table.state=content.state,
    table.reason=content.reason
    await table.save().then(async()=>{
        ctx.body={code:200,message:"提交申请成功"}
    }).catch(err=>{
        ctx.body={code:500,message:err}
    })
})

//添加活动

router.post('/activity/add',async(ctx)=>{
    let content=ctx.request.body
    console.log(content)
    const activity=mongoose.model('Activity')
    let a=new activity()
        a.name=content.name
        a.cId=content.cid
        a.apply_date=new Date()
        a.start_time=content.start
        a.end_time=content.end
        a.number=content.number
        a.budget=content.budget
        a.detail=content.detail
        a.image=""
        a.limited=content.limit
        a.cName=content.place
        a.a_pass=null
        a.b_pass=null
        await a.save().then(res=>{
            ctx.body={code:200,message:"发布成功"}
        }).catch(err=>{
            ctx.body={code:500,message:err}
        })
})
//获得未审核的活动列表
router.get('/activity/waitPass',async(ctx)=>{
    let cid=ctx.query.cid
    const activity=mongoose.model('Activity')
    await activity.aggregate([
        {
            $match:{
                    "cId":cid,
                    $or:[
                        {"a_pass":null},
                        {"b_pass":null}
                    ]
                    }
       },
        // {
        //     $lookup:{
        //         from:"clubs",
        //         localField:"cId",
        //         foreignField:"cId",
        //         as:"items"
        //     }
        // },
    ],
      ).then(async(result)=>{
          console.log(result+"result")
          ctx.body={code:200,activities:result}
            
      }).catch(err=>{
          ctx.body={code:500,message:err}
      })
})

router.get('/activity/pass',async(ctx)=>{
    let cid=ctx.query.cid
    const activity=mongoose.model('Activity')
    await activity.aggregate([
        {
            $match:{
                    "cId":cid,
                    "a_pass":true,
                    "b_pass":true
                    
                    }
       },
        // {
        //     $lookup:{
        //         from:"clubs",
        //         localField:"cId",
        //         foreignField:"cId",
        //         as:"items"
        //     }
        // },
    ],
      ).then(async(result)=>{
        //   for(let i=0;i<result.length;i++){
        //       if(result.limited===1)
        //         result.limited="面向全校"
        //       else if(result.limited===2)
        //         result.limited="面向分院"
        //       else
        //       result.limited="面向社团内部"
        //   }
          console.log(result+"result")
          ctx.body={code:200,activities:result}
            
      }).catch(err=>{
          ctx.body={code:500,message:err}
      })
})

module.exports =router