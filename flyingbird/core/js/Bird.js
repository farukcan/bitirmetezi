/**
 * Created by Can on 8.4.2016.
 */
function Bird(locx,locy,right){
    this.loc = new Vec2(locx,locy);
    this.size = 20;
    this.aspect = 12200/4760;
    if(right)
        this.speed = new Vec2(SABITLER.STANDARTSPEED,0);
    else
        this.speed = new Vec2(-SABITLER.STANDARTSPEED,0);
    this.right = right;
    this.world;
    this.visible=true;
    this.ad = "kartal"
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

        r.color("orange");


        if(this.right)
            r.text(this.ad,-this.size/2*this.aspect-50,this.size/2);
        else
            r.text(this.ad,this.size/2*this.aspect+50,this.size/2);



        if(!this.right)
            r.scale(-1,1);

        r.rotate(-this.speed.y);

        // mevcut origine göre koordinatlara çiz


        r.image(imgbird,-this.size/2*this.aspect,-this.size/2,this.size*this.aspect,this.size);


        //r.rect(-this.size/2,-this.size/2,this.size,this.size); // burası resim ile değiştirelecek


        camera.end();

    },
    update : function(delta){
        if((this.loc.y-this.size/2)>this.world.earthR){
            if((this.loc.y)>(this.world.earthR+this.world.atmosphere)) this.speed.y=-Math.abs(this.speed.y);
            this.speed.add(this.world.gravity.mul(delta,true));
            this.speed.y = limit(this.speed.y,-SABITLER.MAXSPEEDY,SABITLER.MAXSPEEDY);
            this.loc.add(this.speed.mul(delta,true));
        }else{
            //çarptı ve öldü
        }
    }
}