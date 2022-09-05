const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const HomeRoute = require('./routes/HomeRoute')
const {Server} = require('socket.io');
const  {v4} = require('uuid')
const io = new Server(server)
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join("public")))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(HomeRoute.path, HomeRoute.router)

server.listen(80, ()=> console.log('Server Ready 80'))

let data = []
io.on('connection', (socket)=>{
    let user = data.find(e => e.socket_id == socket.id)
    const id = v4()
    if(!user){
        user = {
            id: id,
            socket_id: socket.id
        }
        data.push(user)
        socket.emit('ulanish', id)
    }
    socket.on('peer', id =>{
        let userIndex = data.findIndex(e => e.socket_id == socket.id)
        data[userIndex]["peer_id"] = id;
        user = data[userIndex];
    })

    socket.on('call', id => {
        if(id == user.id){
            socket.emit('error', 'siz o`zingizga qongiroq qila olmaysiz');
        }else if(data.findIndex(e => e.id == id) == -1){
            socket.emit('error', 'Bunday odam yo`q');
        }else{
            let friendId = data.find(e => e.id == id);
            let user = data.find(e => e.socket_id == socket.id)
            socket.to(friendId.socket_id).emit('call', user.peer_id)
        }
    })


    io.on('disconnect', (socket)=>{
        data.filter(e => e.socket_id !== socket.id)
    })
})



