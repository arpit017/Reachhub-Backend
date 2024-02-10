var jwt = require("jsonwebtoken");
require("dotenv").config();


const authentication=async(req,res,next)=>{
const token=req.headers.authorization?.split(" ")[1]
// console.log(token)
if(!token){
  return  res.send("token not found in auth md")
}
jwt.verify(token, process.env.SECRET, function(err, decoded) {
    // console.log(decoded)
    if(decoded){
        req.body.userID=decoded.userID
        console.log(req.body.userID)
        next()
        }else{
            res.send("token doesn't match")
        }
  });
 


}

module.exports={authentication}