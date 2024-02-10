const mongoose=require("mongoose")

const playerSchema=mongoose.Schema({
    name:String,
    rating:Number,
    history:Array
    
})

const PlayerModel= mongoose.model("player",playerSchema)

module.exports={PlayerModel}