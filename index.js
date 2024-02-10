const express = require("express");
const { connection } = require("./connection/connection"); // Ensure this path is correct, noticed it was misspelled in your snippet.
const {PlayerModel}=require("./models/Player.Model")
const {playerRouter}=require("./routes/playerRoutes")
const {userRouter}=require("./routes/userRoutes")
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./Swagger.json");
const cors=require("cors")
const app = express();
app.use(express.json());
app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
let userPut;

import('./initial.mjs').then((module) => {
    userPut = module.default; // For a default export
}).catch(err => {
    console.error('Failed to import initial.mjs:', err);
});

app.get("/initialise", async (req, res) => {
    try {
        await PlayerModel.deleteMany({})
        let data = await userPut();
        // Use Promise.all to wait for all save operations to complete.
        await Promise.all(data.map(ele => {
            let user = new PlayerModel({
                name: ele.name,
                rating:ele.rating,
                history: ele.history
            });
            return user.save(); // Return the promise to be awaited by Promise.all
        }));
        res.status(200).send("Initialization done"); // Assuming "done" means initialization success
    } catch (err) {
        // Send a more informative error response
        res.status(500).send({ message: "Error initializing data", error: err.message });
    }
});
app.use("/users",userRouter)
app.use("/",playerRouter)

app.listen(8080, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB at port 8080");
    } catch (err) {
        console.log(err);
    }
});