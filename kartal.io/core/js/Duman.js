/**
 * 
 * @param x
 * @param y
 * @param vx
 * @param vy
 * @param vr
 * @constructor
 */
function Duman(x,y,vx,vy,vr){
    this.loc = new Vec2(x,y);
    this.speed= new Vec2(vx,vy);
    this.r = Math.floor(2*Math.random()+1);
    this.opacity=1;
    this.vr=vr;
    this.destroyme = false;
}

/**
 * 
 * @type {{draw: Duman.draw}}
 */
Duman.prototype = {
    draw : function(){
        this.opacity-=0.02;
        this.r+=this.vr;
        this.loc.add(this.speed);
        if(this.opacity<=0) return this.destroyme=true;

        camera.begin();

        var loc = this.loc.Angular2Analitic();

        r.translate(  loc.x, loc.y );

        r.context.globalAlpha = this.opacity;

        r.color("#F1F1F1");
        r.circle(0,0,this.r);
        r.fill();

        camera.end();
    }
}