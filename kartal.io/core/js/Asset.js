/**
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param img
 * @constructor
 */
function Asset(x,y,w,h,img){
    this.loc = new Vec2(x,y);
    this.w = w;
    this.h = h;
    this.img = img;
    this.rota = Math.PI/2;
}
/**
 *
 * @type {{draw: Asset.draw}}
 */
Asset.prototype = {
    draw : function (r) {
        camera.begin();

        var loc = this.loc.Angular2Analitic();

        // origini değiştir
        r.translate(  loc.x, loc.y );

        r.rotate(this.loc.x+this.rota);

        r.image(this.img,-this.w/2,-this.h/2,this.w,this.h);

        camera.end();

    }
};