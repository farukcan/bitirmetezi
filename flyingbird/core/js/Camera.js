/**
 * Created by Can on 8.4.2016.
 */
function Camera(loc){
    this.loc = loc;
    this.speed = 100;
    this.a = 0.001;
    this.scale = 1;
    this.rota = (this.a%360)*Math.PI/180;
    this.r;
}

Camera.prototype = {
    setRota : function (x){
        this.a = x;
        return this.rota = (this.a%360)*Math.PI/180;
    },
    begin : function(){
        r.context.save();
        r.context.scale(this.scale,this.scale);

        r.context.translate(r.canvas.width/2, r.canvas.height/2);

        r.context.rotate(this.rota);

        r.context.translate(this.loc.x ,this.loc.y);


    },
    end : function(){
        r.context.restore();
    },
    rotateDraw : function(draw,r,angle,x,y){
        r.context.save();
        r.context.translate(x, y);
        r.context.rotate(angle);
        draw();
        r.context.restore();

    }
}