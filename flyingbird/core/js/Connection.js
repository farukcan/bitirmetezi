/**
 * Created by Can on 9.4.2016.
 */
function ConnectionController(){
    this.connections = [];
    this.connected = 0;
    this.disconnected = 0;
}
ConnectionController.prototype = {
    addConnection : function(socket){
        var conn = new Connection(socket,this.connected++);
        socket.conn = conn;
        conn.controller = this;
        this.connections.push(conn);
        return conn;
    },
    update : function(world){
        // her bir kuş için loc,speed,size gönder
        // sadece görüş alanına girenlerin verisini gönder.
        var data = {
            birds: [],
            time : Date.now()
        };

        world.birds.forEach(function(bird,i){
            data.birds.push(rtBird(bird,i));
        });
        world.server.io.emit("update",data);
    }
};


function Connection(socket,id){
    this.socket = socket
    this.controller;
    this.id = id;
    this.name="";
}
Connection.prototype = {
    disconnect : function(bird){
        // num of disconnecteds ++
        this.controller.disconnected++;

        // find in connections array and destrol
        var m=-1;
        var id= this.id;
        this.controller.connections.every(function(o,i){
            if(id == o.id){
                m = i;
                return false;
            }
            return true;
        });
        if(m!=-1) this.controller.connections.splice(m,1);

        if(bird){
            bird.world.deleteBird(bird.id);
        }


    },
    sendBirds : function(world,you){
        var socket = this.socket;
        world.birds.forEach(function(bird,i){
            socket.emit("addBird",svBird(bird,i));
        });
        world.foods.forEach(function(food,i){
            socket.emit("addFood",svFood(food,i));
        });
        this.socket.emit("youare",you);


    }
};