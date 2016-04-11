/**
 * Created by Can on 8.4.2016.
 */
function World(){
    this.earthR = SABITLER.EARTHR;
    this.atmosphere = SABITLER.ATMOSPHERE;
    this.birds = [];
    this.birdINC = 0;
    this.leftCount = 0;
    this.rightCount = 0;
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
    addBird : function(bird,i){
        bird.world = this;
        if(typeof i == "undefined")
            this.birds.push(bird);
        else
            this.birds[i] = bird;
        bird.id = this.birdINC++;
        if(bird.right) bird.world.rightCount++;
        else bird.world.leftCount++;
        this.server.addBird(bird,(this.birds.length-1));
    },
    addFood : function(food){
        this.foods.push(food);
        this.server.addFood(food,(this.foods.length-1));
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
            this.removeBird(m);
        }

    },
    removeBird : function(m){
        if(this.birds[m].right) this.birds[m].world.rightCount--;
        else this.birds[m].world.leftCount--;
        this.server.deleteBird(m);
        this.birds[m].world = null;
        this.birds.splice(m,1);
    },
    deleteFood : function(m){
        this.server.deleteFood(m);
        this.foods.splice(m,1);
    }
};

World.prototype.server = {
    addBird : function (){},
    addFood : function (){},
    deleteBird : function (){},
    deleteFood : function (){}
}
