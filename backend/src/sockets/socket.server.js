const {Server} = require('socket.io');
const cookie = require('cookie');
const jwt  = require('jsonwebtoken')
const userModel = require('../models/user.models')


function initSocketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.use(async(socket, next) => {

        const cookie = cookie.parse(socket.handshake.headers?.cookie || "");
        console.log("socket connection cookie", cookie)


        if(!cookie.token) {
            next(new Error("Authentication error: No token provided"))
        }

        try {
            const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET)
           const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        }
        catch(err){
            next(new Error("Authentication error: Invalid token"))

        }
    })

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id)
    })
}

module.exports = initSocketServer