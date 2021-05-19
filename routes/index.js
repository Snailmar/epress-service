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
router.post('/get_content', async (req, res) => {
  var query = req.body
  console.log('query',query)
  const dbres = await db.find('content', { content_id: Number(query.content_id) })
  console.log('dbres',dbres)
  res.send({message:dbres[0]||[]})
})

// 检测是否存在用户，不存在就创建一个用户
async function checkUserExist(openid) {
  const res = await db.find('user', { openid })
  console.log('res::', res)
  if (res && res.length) {
    return
  }
  process.nextTick(() => {
    db.insert('user', { openid })
  })
}
// 加入书架
router.post('/add_to_bookshelf',async(req,res)=>{
  console.log('add_to_bookshelf:',req.body)
  db.update('bookshelf',{openid:req.body.openid},{'$addToSet':{data:req.body}})
  res.send({})
})
module.exports = router;
