const { Router } = require("express");
const { PlayerModel } = require("../models/Player.Model");
const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { parse } = require("json2csv");
require("dotenv").config();
const playerRouter = Router();

playerRouter.get("/top-players", async (req, res) => {
  const top_players = await PlayerModel.find()
    .sort({ rating: -1 })
    .limit(50)
    .select("name rating");
  res.send(top_players);
});

playerRouter.get("/player/:username/rating-history", async (req, res) => {
  try {
    const username = req.params.username;
    console.log(username);

    // const history=await PlayerModel.findOne({ username }, { history: { $slice: -30 } }).sort({ "history.date": -1 });
    const history=await PlayerModel.findOne({ name:username })
    
    
    res.send(history.history.slice(-30).reverse());

  } catch (error) {
    console.error("Error fetching player rating history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

playerRouter.get("/players/rating-history-csv", async (req, res) => {
    try {
      const playersData = await PlayerModel.find()
      .sort({ rating: -1 })
      .limit(50)
  
      let data = playersData.map((ele)=>{
        return {
          name:ele.name,
          rating:ele.rating,
          history: ele.history.slice(-30).map(entry => entry[3]), 
          totalhistory: ele.history.map(entry => entry[3]) 
          // history:ele.history.splice(-30).reverse(),
          // totalhistory:ele.history
        }
      })
      const fields = ['name', 'rating', 'history',"totalhistory"];
  
      const csv = parse(data, { fields });
  
      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
      // Send CSV as response
      res.send(csv);
  
    } catch (err) {
      console.error("Failed to fetch players data:", err);
      res.status(500).send("Internal server error");
    }
  });

module.exports = { playerRouter };

