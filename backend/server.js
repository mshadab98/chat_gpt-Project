require('dotenv').config();
const app = require('./src/app');
const connectDb = require("./src/db/db")


connectDb();

app.listen(5050, () => {
    console.log("server is running on port 5050")
})