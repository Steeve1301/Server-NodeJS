let io= require('socket.io')(process.env.PORT || 52300);

//Custom Classes
let Player= require('./Classes/Player.js');

let players= [];
let sockets= [];

console.log('Server has started');

io.on('connection', (socket)=>{
    console.log("Connection made!");

    let player= new Player();
    let thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    //Tell the client that is our id for the server
    socket.emit('register', {id: thisPlayerID});
    socket.emit('spawn', player); //Tell myself i have spawned
    socket.broadcast.emit('spawn', player); //Tell others i have spawned


    //Tell myself about everyone else in the game
    for(let playerID in players){
        if(playerID != thisPlayerID){
            socket.emit('spawn', player[playerID]);
        }
    }

    //Positional Data from Client
    socket.on('updatePosition', (data)=>{
        player.position.x = data.position.x;
        player.position.y= data.position.y;

        socket.broadcast.emit('updatePosition', player);
    });

    socket.on('disconnect', () =>{
       console.log("A player is now disconnected");
       delete players[thisPlayerID];
       delete sockets[thisPlayerID];
       socket.broadcast.emit('disconnected', player);
    });
});