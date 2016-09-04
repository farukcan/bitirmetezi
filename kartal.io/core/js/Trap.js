/**
 * Trap
 * @param locx
 * @param locy
 * @constructor
 */
function Trap(locx,locy){
    this.loc = new Vec2(locx,locy);
    this.size = 20+Math.random()*60;
    this.visible = true;
}

/**
 *
 * @type {{draw: Trap.draw}}
 */
Trap.prototype = {
    draw : function(r){
        if(!this.visible) return;

        camera.begin();

        var angular = this.loc.Angular2Analitic();

        r.color("red");
        r.drawStar(angular.x,angular.y,7,Math.floor(this.size/3*2),this.size);
        r.fill();

        camera.end();
    }
}