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
    update : function(){

    }
};


function Connection(socket,id){
    this.socket = socket
    this.controller;
    this.id = id;
    this.name="Player"+Math.floor(Math.random()*50000);
}
Connection.prototype = {
    disconnect : function(){
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


    }
};