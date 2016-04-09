/**
 * Created by Can on 8.4.2016.
 */
function World(){
    this.earthR = SABITLER.EARTHR;
    this.atmosphere = SABITLER.ATMOSPHERE;
    this.birds = [];
    this.foods = [];
    this.camera;
    this.gravity = new Vec2(0,SABITLER.GRAVITY);
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
    },
    addFood : function(food){
        this.foods.push(food);
    }
};