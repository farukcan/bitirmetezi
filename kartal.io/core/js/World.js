/**
 * 
 * @param r
 * @constructor
 */
function World(r){
    this.earthR = SABITLER.EARTHR;
    this.atmosphere = SABITLER.ATMOSPHERE;
    this.birds = [];
    this.birdINC = 0;
    this.leftCount = 0;
    this.rightCount = 0;
    this.foods = [];
    this.traps = [];
    this.assets = [];
    this.dumanlar = [];
    this.camera;
    this.gravity = new Vec2(0,SABITLER.GRAVITY);
    this.serverSide = false;
    if(r){
        this.skyGradient =  r.context.createRadialGradient(100, 50 , this.earthR, 100, 500, this.earthR+this.atmosphere);
        this.skyGradient.addColorStop(0, '#BDEEFF');
        this.skyGradient.addColorStop(1, '#84E0FF');
    }
}

/**
 * 
 * @type {{draw: World.draw, update: World.update, addBird: World.addBird, addFood: World.addFood, addTrap: World.addTrap, findIndexById: World.findIndexById, deleteBird: World.deleteBird, removeBird: World.removeBird, deleteFood: World.deleteFood, deleteTrap: World.deleteTrap}}
 */
World.prototype = {
    draw : function(r){
        this.camera.begin();
        r.circle(0,0,this.earthR+this.atmosphere);
        r.context.fillStyle = this.skyGradient;
        r.fill();
        r.color("#17D736");
        r.circle(0,0,this.earthR);
        r.fill();
        this.camera.end();

        this.assets.forEach(function(asset,i){
            asset.draw(r);
        });

        this.birds.forEach(function(bird){
            bird.draw(r);
        });

        this.foods.forEach(function(food){
            food.draw(r);
        });

        this.traps.forEach(function(trap){
            trap.draw(r);
        });
        var destroyAssets = [];
        var dumanlar = this.dumanlar;
        dumanlar.forEach(function(duman,i){
            if(duman.destroyme) destroyAssets.push(i);
            else duman.draw(r);
        });
        destroyAssets.forEach(function(i){
            dumanlar.splice(i,1);
        });
    },
    update : function(delta){
        this.birds.forEach(function(bird){
            bird.update(delta);
        });
        this.server.detectCollisions(this,delta);
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
    addTrap : function (trap) {
        this.traps.push(trap);
        this.server.addTrap(trap,(this.traps.length-1));
    },
    findIndexById : function(id){
        var m=-1;
        this.birds.every(function(o,i){
            if(id == o.id){
                m = i;
                return false;
            }
            return true;
        });
        return m;
    },
    deleteBird : function(id){
        var m = this.findIndexById(id);
        if(m!=-1) {
            this.removeBird(m);
        }
    },
    removeBird : function(m){
        if(this.birds[m] == undefined) return;
        if(this.birds[m].right) this.birds[m].world.rightCount--;
        else this.birds[m].world.leftCount--;
        this.server.deleteBird(m);
        this.birds[m].world = null;
        this.birds.splice(m,1);
    },
    deleteFood : function(m){
        this.server.deleteFood(m);
        this.foods.splice(m,1);
    },
    deleteTrap : function (m) {
        this.server.deleteTrap(m);
        this.traps.splice(m,1);
    }
};

World.prototype.server = {
    addBird : function (){},
    addFood : function (){},
    addTrap : function (){},
    deleteBird : function (){},
    deleteFood : function (){},
    deleteTrap : function (){},
    detectCollisions : function(){}
};
