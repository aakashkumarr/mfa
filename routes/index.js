var express = require("express");
var router = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
/* GET home page. */
let dataObj={sec:null}
router.get("/", function (req, res, next) {
  let sec = speakeasy.generateSecret({ length: 20 });
  let data = "";

  QRCode.toDataURL(sec.otpauth_url, function (err, data_url) {
    let data = data_url;
    console.log(data_url);
    dataObj.sec=sec;
    res.render("index", { title: "Express", url: data_url });
  });
  console.log(sec, data);
});

router.get("/verify", function (req, res) {
  let { token } = req.query;
  console.log(dataObj.sec,token)
  if(!token) return res.send('error token')
  let verify = speakeasy.totp.verify({
    secret: dataObj.sec.base32,
    encoding: "base32",
    token: token,
  });
  if (verify) {
    console.log("user verified successfully");
    res.send("user verified successfully");
  } else {
    console.log("verification faild");
    res.send("verification faild");
  }
});

module.exports = router;
