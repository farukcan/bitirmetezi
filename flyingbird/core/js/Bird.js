/**
 * Created by Can on 8.4.2016.
 */
function Bird(locx,locy){
    this.loc = new Vec2(locx,locy);
    this.size = 20;
    this.aspect = 12200/4760;
    this.speed = new Vec2(Math.PI/(7200*8),0);
    this.right = true;
    this.world;
    this.visible=true;
}

Bird.prototype = {
    draw : function(r){
        if(!this.visible) return;

        camera.begin();

        r.color("orange");

        var angular = this.loc.Angular2Analitic();

        // origini değiştir
        r.translate(  angular.x, angular.y );

        // yeni orginde göndür
        if(this.right)
            r.rotate(this.loc.x+Math.PI/2-this.speed.y);
        else
            r.rotate(this.loc.x-Math.PI/2);
        // mevcut origine göre koordinatlara çiz

        r.image(imgbird,-this.size/2*this.aspect,-this.size/2,this.size*this.aspect,this.size);


        //r.rect(-this.size/2,-this.size/2,this.size,this.size); // burası resim ile değiştirelecek


        camera.end();

    },
    update : function(delta){
        this.speed.add(this.world.gravity.mul(delta,true));
        this.loc.add(this.speed.mul(delta,true));

    }
}