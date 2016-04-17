/**
 * Created by Can on 8.4.2016.
 */
function Bird(locx,locy,right){
    this.loc = new Vec2(locx,locy);
    this.size = 20;
    this.aspect = 12200/4760;this.kntx=604.719;this.knty=185.188;this.knts=4,this.kntdelay=600;;
    this.rightPolar = -1;
    if(right)
        this.rightPolar = 1;
    this.speed = new Vec2(this.rightPolar*SABITLER.STANDARTSPEED,0);
    this.right = right;
    this.world;
    this.visible=true;
    this.ad = "kartal";
    this.hp = 20;
    this.living = true;
    this.a = 0;
    this.nitro = false;
    this.nitroTime = 0;
    this.knti = 0;
    this.tip = Math.round((BIRD_TYPES.length-1)*Math.random());
}

Bird.prototype = {
    draw : function(r){
        if(!this.visible) return;

        camera.begin();


        var angular = this.loc.Angular2Analitic();

        // origini değiştir
        r.translate(  angular.x, angular.y );



        // yeni orginde göndür
        r.rotate(this.loc.x+Math.PI/2);

        if(clientConfig.names){
            r.color("orange");


            if(this.right)
                r.text(this.ad,-this.size/2*this.aspect-50,this.size/2);
            else
                r.text(this.ad,this.size/2*this.aspect+50,this.size/2);
        }

        if(!this.right)
            r.scale(-1,1);

        r.rotate(-this.speed.y);

        // mevcut origine göre koordinatlara çiz


        if(debug){
            r.strokeStyle("white");
            r.ellipse(0,0,this.size*this.aspect,this.size);
        }

        r.image(imgbird[this.tip],-this.size/2*this.aspect,-this.size/2,this.size*this.aspect,this.size);

        if(this.speed.y!=0)
            this.knti=Math.floor(Date.now()%this.kntdelay/this.kntdelay*this.knts);
        r.scale(-1,1);
        r.imageClipped(kanat,this.kntx/this.knts*this.knti,0,Math.floor(this.kntx/this.knts),Math.floor(this.knty),-this.size/10*this.aspect,-this.size/2,this.size*this.kntx/this.knty/this.knts,this.size);

        camera.end();

        if(debug){
            camera.begin();
            r.strokeStyle("white");
            var bird= this;
            this.world.foods.forEach(function(food,m) {
                var birdLA = bird.loc.Angular2Analitic();
                var foodLA = food.loc.Angular2Analitic();

                var b = bird.right ? bird.loc.x - bird.speed.y : bird.loc.x + bird.speed.y;
                var a =  birdLA.angleBetween(foodLA)-b;
                var birdD = findLenght( - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b) ,((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b) );
                if(foodLA.d(birdLA) < (birdD+food.size+500))
                    r.line(foodLA.x,foodLA.y,birdLA.x - ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.sin(b) + ((bird.size/2) * Math.cos(a)) * Math.cos(b),birdLA.y+ ((bird.size/2) * Math.cos(a)) * Math.sin(b) + ((bird.size * bird.aspect /2) * Math.sin(a)) * Math.cos(b));
            });
            camera.end();
        }


            },
    update : function(delta){
        if(!this.living) return; //yaşamıyorsa fizikselliği olmaz
        if((this.loc.y-this.size/2)>this.world.earthR){
            if((this.loc.y)>(this.world.earthR+this.world.atmosphere)) (this.speed.y=-Math.abs(this.speed.y)) && (this.loc.y =this.world.earthR+this.world.atmosphere);
            this.speed.y+=this.a*delta;
            this.speed.add(this.world.gravity.mul(delta,true));
            this.speed.y = limit(this.speed.y,-SABITLER.MAXSPEEDY,SABITLER.MAXSPEEDY);
            if(this.nitro) {
                this.nitroTime -= delta;
                if(this.nitroTime<=1){
                    this.nitro=false;
                }else{
                    this.loc.x+=this.speed.x*this.nitroTime/100;
                }
            }
            this.loc.add(this.speed.mul(delta,true));
            if(this.a!=0)
                this.a += -this.a/Math.abs(this.a)*SABITLER.IVMESELDUSUS;
        }else{
            this.kill();
        }
    }
}

Bird.prototype.kill = function(){};
