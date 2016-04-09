/**
 * Created by Can on 8.4.2016.
 */
function World(){
    this.earthR = SABITLER.EARTHR;
    this.atmosphere = SABITLER.ATMOSPHERE;
    this.birds = [];
    this.birdINC = 0;
    this.foods = [];
    this.camera;
    this.gravity = new Vec2(0,SABITLER.GRAVITY);
    this.serverSide = false;
}

World.prototype = {
    draw : function(r){
        this.camera.begin();
        r.color("#9CE4F9");
        r.circle(0,0,this.earthR+this.atmosphere);
        r.fill();
        r.color("#17D736");
        r.circle(0,0,this.earthR);
        r.fill();
        this.camera.end();

        this.foods.forEach(function(food){
            food.draw(r);
        });

        this.birds.forEach(function(bird){
            bird.draw(r);
        });

    },
    update : function(delta){
        this.birds.forEach(function(bird){
            bird.update(delta);
        });
    },
    addBird : function(bird){
        bird.world = this;
        this.birds.push(bird);
        bird.id = this.birdINC++;
        if(this.serverSide) this.server.addBird(bird);
    },
    addFood : function(food){
        this.foods.push(food);
        if(this.serverSide) this.server.addFood(food);
    },
    deleteBird : function(id){
        // find in connections array and destrol
        var m=-1;
        this.birds.every(function(o,i){
            if(id == o.id){
                m = i;
                return false;
            }
            return true;
        });

        if(m!=-1) {
            if(this.serverSide) this.server.deleteBird(m);
            this.birds[m].world = null;
            this.birds.splice(m,1);
        }

    },
    deleteFood : function(m){
        if(this.serverSide) this.server.deleteFood(m);
        this.foods.splice(m,1);
    }
};