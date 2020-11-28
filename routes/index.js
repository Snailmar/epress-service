const config=require('../config')
var express = require("express");
var router = express.Router();
var got = require("got");
const pool=require('../utils/db')
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
/**post 登录*/
router.post("/getlogin", async function (req, res, next) {
  console.log('req',req.body);
  var body=req.body
 var data={
   appid:config.APPID,
   secret:config.APP_SECRET,
    js_code:body.js_code,
    grant_type:config.GRANT_TYPE

  }

  let url =
    "https://api.weixin.qq.com/sns/jscode2session";
      (async () => {
        console.log('data',data)
        let result = await got(url,{searchParams:data} );
        console.log('result', result.body)
        res.send(JSON.parse(result.body));
      })();
});

router.post('/query',function(req,res,next){
  pool.query('SELECT * FROM `wish` where name ="jack"',function(err,results){
    res.send(results)
  })
})

module.exports = router;
