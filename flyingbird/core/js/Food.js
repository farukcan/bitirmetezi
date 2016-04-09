/**
 * Created by Can on 9.4.2016.
 */
function Food(locx,locy){
    this.loc = new Vec2(locx,locy);
    this.size = 3+Math.random()*10;
    this.visible = true;
}

Food.prototype = {
    draw : function(r){
        if(!this.visible) return;

        camera.begin();

        var angular = this.loc.Angular2Analitic();

        r.color("orange");
        r.circle(angular.x,angular.y,this.size);
        r.fill();


        camera.end();
    }
}