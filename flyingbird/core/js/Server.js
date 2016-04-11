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
    },
    detectCollisions : function(world,delta){
        // foods

        world.birds.forEach(function(bird,i){
            // kuşların yemek yemesi
            world.foods.forEach(function(food,m){
                var birdLA = bird.loc.Angular2Analitic();
                var foodLA = food.loc.Angular2Analitic();
                var b = bird.right ? bird.loc.x - bird.speed.y : bird.loc.x + bird.speed.y;
                var a =  birdLA.angleBetween(foodLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );

               if(foodLA.d(birdLA) < (birdD+food.size)) {
                   bird.size+=Math.sqrt(food.size);
                   world.deleteFood(m);
                   world.addFood(new Food(Math.random()*Math.PI*2,world.earthR+Math.random()*world.atmosphere));
               }
            });
            // kuşların birbirini yemesi
            world.birds.forEach(function(anotherBird,j){
                var birdLA = bird.loc.Angular2Analitic();
                var anotherBirdLA = anotherBird.loc.Angular2Analitic();
                var birdD = findLenght( bird.size*bird.aspect*Math.cos(birdLA.angleBetween(anotherBirdLA)-bird.speed.y) ,bird.size*Math.sin(birdLA.angleBetween(anotherBirdLA)-bird.speed.y) );
                if(birdLA.d(anotherBirdLA) < ( birdD  + anotherBird.size) && i!=j){
                    //
                    console.log("Kuşlar Çarpıştı");
                }
            });
        });

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