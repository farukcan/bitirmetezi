/**
 * Created by Can on 16.4.2016.
 */
function RGB(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
}
RGB.prototype = {
    toString : function(){
        return "rgb("+this.r+","+this.g+","+this.b+")";
    }
};
