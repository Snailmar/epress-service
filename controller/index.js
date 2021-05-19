var mongoConfig = require('../config/mongo')
const MongoClient = require('mongodb').MongoClient;
const db={}
// add
// db.add=(collection,data={})=>{
// const client = new MongoClient(mongoConfig.host)
//     return new Promise((resolve,reject)=>{
//         client.connect(function (err) {
//             const db = client.db(mongoConfig.database)
//             db.collection(collection).insertOne(data, (err, result) => {
//                 if (err) {
//                     return;
//                 }
//                 resolve(result)
//                 // 操作数据库完成以后要关闭数据库连接
//                 client.close();
//             })
//         })

//     })
// }
db.find=(collection,data)=>{
const client = new MongoClient(mongoConfig.host)
    return new Promise((resolve,reject)=>{
        client.connect(function (err) {
            const db = client.db(mongoConfig.database)
           db.collection(collection).find(data).toArray((err,result) =>{
               if(err){
                   return
               }
               resolve(result);
           })
        })

    })
}
db.insert=(collection, data)=>{
const client = new MongoClient(mongoConfig.host)
    return new Promise((resolve,reject)=>{
        client.connect(function (err) {
            const db = client.db(mongoConfig.database)
            console.log(db,'9900')
            db.collection(collection).insertOne(data).then((err,result)=>{
                if(err){
                    return
                }
                resolve(result);
                client.close();
            })
        })

    })
}
db.update=(collection,data,newData)=>{
const client = new MongoClient(mongoConfig.host)
    return new Promise((resolve,reject)=>{
        client.connect(function (err) {
            const db = client.db(mongoConfig.database)
            db.collection(collection).updateOne(data, newData,{upsert:true},(err, result) => {
                if (err) {
                    return;
                }
                resolve(result)
                // 操作数据库完成以后要关闭数据库连接
                client.close();
            })
        })

    })
}
module.exports = db