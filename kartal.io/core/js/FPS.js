/**
 * Created by Can on 11.4.2016.
 */
function FPSCalculator(){
    this.FPScache=Date.now();
    this.FPS;
    this.delta;
    this.calc = function(){
        this.delta = (Date.now() - this.FPScache);
        this.FPS = Math.floor(1000/this.delta);
        this.FPScache=Date.now();
    }
    this.reflesh = function(){
        this.FPScache=Date.now();
    }
}