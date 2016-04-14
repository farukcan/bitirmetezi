/**
 * Created by Can on 10.4.2016.
 */

/*
 |--------------------------------------------------------------------------
 | Server-Side Prototypes of Classes
 |--------------------------------------------------------------------------
 */



Bird.prototype.kill = function(){
    if(this.living){
        // yaşıyorsa öldürebilirsin.
        this.living = false;
        this.hp = 0;
        var bird=this;
        setTimeout(function(){
            try{
                bird.conn.socket.disconnect();
            }catch (err){
                console.log(err);
            }
        },SABITLER.DISTIME)
    }
};

Bird.prototype.damage = function(damage){
    if(this.living){
        this.hp-=damage;
        try{
            this.conn.socket.emit('hp',this.hp);
        }catch (err){
            console.log(err);
        }
        if(this.hp<=0) this.kill();
    }
};

Bird.prototype.heal = function(){
    if(this.living){
        this.hp=limit(this.hp+1,0,this.size);
        try{
            this.conn.socket.emit('hp',this.hp);
        }catch (err){
            console.log(err);
        }
    }
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
            if(!bird.living) return; // kuş yaşamıyorsa çarpma olmaz.
            var birdLA = bird.loc.Angular2Analitic();

            // kuşların yemek yemesi
            world.foods.forEach(function(food,m){
                var foodLA = food.loc.Angular2Analitic();
                var b = bird.right ? bird.loc.x - bird.speed.y : bird.loc.x + bird.speed.y;
                var a =  birdLA.angleBetween(foodLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );

               if(foodLA.d(birdLA) < (birdD+food.size)) {
                   bird.size=Math.sqrt(bird.size*bird.size+food.size*food.size);
                   world.deleteFood(m);
                   world.addFood(new Food(Math.random()*Math.PI*2,world.earthR+Math.random()*world.atmosphere));
               }
            });
            // kuşların birbirini yemesi
            world.birds.forEach(function(anotherBird,j){
                if(!anotherBird.living) return;
                if(i==j) return;
                var anotherBirdLA = anotherBird.loc.Angular2Analitic();
                var b = bird.right ? bird.loc.x - bird.speed.y : bird.loc.x + bird.speed.y;
                var a =  birdLA.angleBetween(anotherBirdLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );
                b = anotherBird.right ? anotherBird.loc.x - anotherBird.speed.y : anotherBird.loc.x + anotherBird.speed.y;
                a =  anotherBirdLA.angleBetween(birdLA)-b;
                var anotherBirdD = findLenght( - ((anotherBird.size * anotherBird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((anotherBird.size/2) * Math.cos(a)) * Math.cos(b) ,((anotherBird.size/2) * Math.cos(a)) * Math.sin(b) + ((anotherBird.size * anotherBird.aspect /2) * Math.sin(a)) * Math.cos(b) );
                if(birdLA.d(anotherBirdLA) < ( birdD  + anotherBirdD)){

                    if(bird.right==anotherBird.right){
                        // eğer yönler aynıysa
                        if(bird.size>anotherBird.size){
                            // biri diğerinde büyükse
                            //diğerini yer
                            bird.size+=anotherBird.size;
                            anotherBird.damage(bird.size);
                        }
                    }else{
                        //yönler farklıysa
                        //ikiside can kaybeder
                        bird.damage(anotherBird.size);
                    }

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