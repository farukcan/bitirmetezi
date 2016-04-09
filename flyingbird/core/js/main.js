/**
 * Created by Can on 8.4.2016.
 */

var r = new CanvasRender("mainCanvas");

// çözünürlük
r.canvas.width = 1366;
r.canvas.height = 768;

// world
var world;
var camera;
var bird;
var socket;



var imgbird = r.loadImage("img/kartal.svg");

$(function(){
    //create();
});


$(document).keydown(function(e){
    switch(e.keyCode) {
        case 37: // left
            camera.loc.x+=camera.speed*Math.cos(camera.rota);
            camera.loc.y-=camera.speed*Math.sin(camera.rota);
            bird.speed.x+=Math.PI/3600;
            break;

        case 38: // up
            camera.loc.x-=camera.speed*Math.cos((camera.a+90)*Math.PI/180);
            camera.loc.y+=camera.speed*Math.sin((camera.a+90)*Math.PI/180);
            break;

        case 39: // right
            camera.loc.x-=camera.speed*Math.cos(camera.rota);
            camera.loc.y+=camera.speed*Math.sin(camera.rota);
            bird.speed.x-=Math.PI/3600;
            break;

        case 40: // down
            camera.loc.x+=camera.speed*Math.cos((camera.a+90)*Math.PI/180);
            camera.loc.y-=camera.speed*Math.sin((camera.a+90)*Math.PI/180);
            break;

        case 107:
            camera.scale-=0.1;
            break;
        case 109:
            camera.scale+=0.1;
            break;
        case 81: //q
            camera.setRota(camera.a+5);
            break;
        case 69: //e
            camera.setRota(camera.a-5);
            break;
        case 32: //space
            bird.speed.y+=0.2;
            break;
        default:
            console.log(e.keyCode);
            return; // exit this handler for other keys
    }
    e.preventDefault();
});

var created;
function create(){
    if(!created){
        $("#gameInfo").hide();
        $("#rules").hide();

        socket = io();
        socket.emit("hi");
        socket.on("disconnect",destroy);

        world = new World();
        camera = new Camera(new Vec2(0,0));
        world.camera = camera;
        camera.r = r;
        world.addBird(new Bird(0,3100));
        bird =new Bird(Math.PI,5100);
        world.addBird(bird);



        FPScache=Date.now(); // update için hata oluşmasın diye
        r.setUpdateFunc(update); //döngü

        created=true;
    }
}

function destroy(){
    if(created){
        created = false;
        $("#gameInfo").fadeIn(4000);
        $("#rules").fadeIn();

        r.removeUpdateFunc();
        try{
            socket.emit("disconnect");
            socket.disconnect();
        }catch(err){}
        socket = null;
        world = null;
        camera = null;
        bird = null;
    }


}

var delta,FPS=60,FPScache=Date.now(),FPSslow;
function update(){
    delta = (Date.now() - FPScache);
    FPS = Math.floor(1000/delta);
    FPScache=Date.now();

    world.update(delta);
    r.clear();
    camera.loc = bird.loc.Angular2Analitic().inverse();
    camera.setRota(-bird.loc.x/Math.PI*180-90);
    world.draw(r);
    r.text("ALPHA TEST",50,20)
    r.text("FPS: " + FPSslow,50,50);

}

setInterval(function(){
    FPSslow = FPS;
},1000);