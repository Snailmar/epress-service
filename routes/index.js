const config = require('../config')
var express = require("express");
var router = express.Router();
var got = require("got");
const pool = require('../utils/db')
const db = require('../controller/index')
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
/**post 登录*/
router.post("/getlogin", async function (req, res, next) {
  console.log('req', req.body);
  var body = req.body
  var data = {
    appid: config.APPID,
    secret: config.APP_SECRET,
    js_code: body.js_code,
    grant_type: config.GRANT_TYPE

  }
  let url =
    "https://api.weixin.qq.com/sns/jscode2session";
  (async () => {
    console.log('data', data)
    let result = await got(url, { searchParams: data });
    console.log('result23', result.body)
    if (result.body) {

      let openid = JSON.parse(result.body).openid
      await checkUserExist(openid)
      res.send({ openid });
      return
    }
    res.send(null)
  })();
});
// 内容id获取播放专辑
router.get('/get_content', async (req, res) => {
  var query = req.query
  console.log('query',query)
  const dbRes = await db.find('content', { content_id: Number(query.content_id) })
  console.log('dbRes',dbRes)
  res.send({message:dbRes[0]||[]})
})

// 检测是否存在用户，不存在就创建一个用户
async function checkUserExist(openid) {
  const res = await findUserByOpenid(openid)
 if(!res){
   process.nextTick(() => {
     db.insert('user', { openid })
   })
 }
}
// 查找用户
async function findUserByOpenid(openid){
  const res = await db.find('user', { openid })
  return res && res.length
}
// 加入书架
router.post('/add_to_bookshelf',async(req,res)=>{
  console.log('add_to_bookshelf:',req.body)
  db.update('bookshelf',{openid:req.body.openid},{'$addToSet':{data:req.body}})
  res.send({})
})
// 查找书架
router.get('/get_bookshelf',async(req,res)=>{
  const dbRes =await db.find('bookshelf',{openid:req.query.openid})
console.log("bookshelf:",dbRes)
  res.send({message:dbRes[0]||[]})
})
module.exports = router;
