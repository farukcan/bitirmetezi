/**
 * Created by Can on 10.4.2016.
 */

/*
 |--------------------------------------------------------------------------
 | Server-Side Prototypes of Classes
 |--------------------------------------------------------------------------
 */



Bird.prototype.kill = function(){

};


World.prototype.collapse = function(birdX,birdY){

};

World.prototype.server = {
    addBird : function (bird,i){
        this.io.emit("addBird",svBird(bird,i));
        bird.conn.sendBirds(bird.world,i);
    },
    addFood : function (food,i){
        this.io.emit("addFood",svFood(food,i));
    },
    deleteBird : function (i){
        this.io.emit("removeBird",i);
    },
    deleteFood : function (i){
        this.io.emit("deleteFood",i);
    }
}


function svBird(bird,i){
    return {
        "locx" : bird.loc.x,
        "locy" : bird.loc.y,
        "right" : bird.right,
        "ad" : bird.ad,
        "i" : i
    };
}

function svFood(food,i){
    return {
        "locx" : food.loc.x,
        "locy" : food.loc.y,
        "i" : i,
        "size" : food.size
    }
}

function rtBird(bird,i){
    return {
        "i" : i,
        "x" : bird.loc.x,
        "y" : bird.loc.y,
        "s" : bird.size
    };
}