/**
 * 
 * @param locx
 * @param locy
 * @constructor
 */
function Food(locx,locy){
    this.loc = new Vec2(locx,locy);
    this.size = 3+Math.random()*20;
    this.visible = true;
}
/**
 * 
 * @type {{draw: Food.draw}}
 */
Food.prototype = {
    draw : function(r){
        if(!this.visible) return;

        camera.begin();

        var angular = this.loc.Angular2Analitic();

        r.color("orange");
        /*r.circle(angular.x,angular.y,this.size);
        r.fill();
        

        r.color("#009999");*/
        r.drawStar(angular.x,angular.y,5,Math.floor(this.size/2),this.size);
        r.fill();


        camera.end();
    }
}