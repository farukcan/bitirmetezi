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

                if(bird.yz){
                    bird.member.kill();
                    bird.world.deleteBird(bird.id);
                }
                else{
                    try{
                        bird.conn.socket.disconnect();
                    }catch (err){
                        console.log(err);
                    }

                }

        },SABITLER.DISTIME)
    }
};

Bird.prototype.damage = function(damage,i){
    if(this.living){
        this.hp-=damage;
        if(this.yz){
            // yapay zekası ise
        }else{
            try{
                this.conn.socket.emit('hp',this.hp);
            }catch (err){
                console.log(err);
            }
        }
        if(this.hp<=0) {
            world.server.io.emit("invisible",i);
            this.kill();
        }
    }
};

Bird.prototype.heal = function(){
    if(this.living){
        this.hp=limit(this.hp+1,0,this.size);
        if(this.yz){
            // yapay zekası ise
        }else{
            try{
                this.conn.socket.emit('hp',this.hp);
            }catch (err){
                console.log(err);
            }
        }
    }
};

Bird.prototype.eat = function(anotherBird,j){
    // biri diğerinde büyükse
    //diğerini yer
    this.size+=anotherBird.size;
    this.size = Math.min(SABITLER.MAXSIZE,this.size);
    anotherBird.damage(this.size,j);
};

World.prototype.collapse = function(birdX,birdY){

};

World.prototype.server = {
    addBird : function (bird,i){
        this.io.emit("addBird",svBird(bird,i));
        if(bird.conn)
            bird.conn.sendBirds(bird.world,i);
    },
    addFood : function (food,i){
        this.io.emit("addFood",svFood(food,i));
    },
    addTrap : function (trap,i) {
        this.io.emit('addTrap',svTrap(trap,i));
    },
    deleteBird : function (i){
        this.io.emit("removeBird",i);
    },
    deleteFood : function (i){
        this.io.emit("deleteFood",i);
    },
    deleteTrap : function (i){
        this.io.emit("deleteTrap",i);
    },
    detectCollisions : function(world,delta){
        // foods

        world.birds.forEach(function(bird,i){
            if(!bird.living) return; // kuş yaşamıyorsa çarpma olmaz.
            var birdLA = bird.loc.Angular2Analitic();
            var b = bird.right ? bird.loc.x - bird.speed.y : bird.loc.x + bird.speed.y;

            // kuşların yemek yemesi
            world.foods.forEach(function(food,m){
                var foodLA = food.loc.Angular2Analitic();
                var a =  birdLA.angleBetween(foodLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );

               if(foodLA.d(birdLA) < (birdD+food.size)) {
                   bird.size=Math.sqrt(bird.size*bird.size+food.size*food.size);
                   bird.size = Math.min(SABITLER.MAXSIZE,bird.size);
                   bird.heal();
                   world.deleteFood(m);
                   world.addFood(new Food(Math.random()*Math.PI*2,world.earthR+Math.random()*world.atmosphere));
               }
            });

            // kuşların tuzağa çarpması
            world.traps.forEach(function (trap,m) {
                var trapLA = trap.loc.Angular2Analitic();
                var a =  birdLA.angleBetween(trapLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );

                if(trapLA.d(birdLA) < (birdD+trap.size)){
                    bird.damage(trap.size,i);
                    world.deleteTrap(m);
                    world.addTrap(new Trap(Math.random()*Math.PI*2,world.earthR+world.atmosphere/2+Math.random()*world.atmosphere/2));
                }
            });


            // ...

            var anotherBird;
            // kuşların birbirini yemesi
            for(var j=i+1;j<world.birds.length;j++){

                anotherBird = world.birds[j]; // anotherbird tanımla

                if(!anotherBird.living) return; // diğer kuş öldüyse boşver
                if(i==j) return;
                var anotherBirdLA = anotherBird.loc.Angular2Analitic();
                var a =  birdLA.angleBetween(anotherBirdLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );
                c = anotherBird.right ? anotherBird.loc.x - anotherBird.speed.y : anotherBird.loc.x + anotherBird.speed.y;
                a =  anotherBirdLA.angleBetween(birdLA)-b;
                var anotherBirdD = findLenght( - ((anotherBird.size * anotherBird.aspect /2) * Math.sin(a)) * Math.sin(c) + ((anotherBird.size/2) * Math.cos(a)) * Math.cos(c) ,((anotherBird.size/2) * Math.cos(a)) * Math.sin(c) + ((anotherBird.size * anotherBird.aspect /2) * Math.sin(a)) * Math.cos(c) );
                if(birdLA.d(anotherBirdLA) < ( birdD  + anotherBirdD)){

                    if(bird.right==anotherBird.right){
                        // eğer yönler aynıysa
                        if(bird.size>anotherBird.size){
                            bird.eat(anotherBird,j);
                        }else{
                            anotherBird.eat(bird,i);
                        }
                    }else{
                        //yönler farklıysa
                        //ikiside can kaybeder
                        bird.damage(anotherBird.size,i);
                        anotherBird.damage(bird.size,j);
                    }

                }

            }// end of for


        });

    }

}


function svBird(bird,i){
    return {
        "locx" : bird.loc.x,
        "locy" : bird.loc.y,
        "right" : bird.right,
        "ad" : bird.ad,
        "tip" : bird.tip,
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

function svTrap(trap,i){
    return {
        "locx" : trap.loc.x,
        "locy" : trap.loc.y,
        "i" : i,
        "size" : trap.size
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

