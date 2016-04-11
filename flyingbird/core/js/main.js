/**
 * Created by Can on 8.4.2016.
 */

var r = new CanvasRender("mainCanvas");

// çözünürlük
var renderKalite = 1;
r.canvas.width = window.innerWidth*renderKalite;
r.canvas.height = window.innerHeight*renderKalite;

// world
var world;
var camera;
var bird;
var socket;

// debug mode
var debug = true;



var imgbird = r.loadImage("img/kartal.svg");

$(function(){
    //create();
});


$(document).keydown(function(e){
    switch(e.keyCode) {
        /*case 37: // left
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
         */
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
            if(socket)
                socket.emit("fly");
            break;
        default:
            console.log(e.keyCode);
            return; // exit this handler for other keys
    }
    e.preventDefault();
});

var created,UPS,UPScache= 0,Udelta;
function create(){
    if(!created){
        $("#gameInfo").hide();
        $("#rules").hide();

        world = new World();

        socket = io();
        socket.emit("hi",$("#nick").val());
        socket.on("disconnect",destroy);
        socket.on("addBird",function(b){
            console.log("#addBird",b);
            var bird = new Bird(b.locx, b.locy, b.right);
            bird.ad = b.ad;
            world.addBird(bird, b.i);
        });
        socket.on("youare",function(i){
            console.log("#youare",i);
           bird = world.birds[i];
        });
        socket.on("removeBird",function(i){
            console.log("#removeBird",i);
            world.removeBird(i);
        });
        socket.on("addFood",function(f){
           console.log("#addFood",f);
            var food = new Food(f.locx, f.locy);
            food.size = f.size;
            world.addFood(food);
        });
        socket.on("deleteFood",function(i){
            console.log("#deleteFood",i);
            world.deleteFood(i);
        });
        socket.on("update",function(data){
            Udelta = data.time - UPScache;
            UPS = Math.floor(1000/Udelta);
            UPScache= data.time;

            data.birds.forEach(function(b){
                if(world.birds[b.i]){

                    world.birds[b.i].speed.y = -(world.birds[b.i].loc.y-b.y)/Udelta;

                    world.birds[b.i].loc.x = b.x;
                    world.birds[b.i].loc.y = b.y;
                    world.birds[b.i].size = b.s;
                }
            });
        });
        socket.on('pong', function() {
            ping = Date.now() - PINGstartTime;
        });


        camera = new Camera(new Vec2(0,0));
        world.camera = camera;
        camera.r = r;


        FPS.reflesh(); // update için hata oluşmasın diye
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

var FPS = new FPSCalculator(),FPSslow=60,UPSslow=60,ping=16;
function update(){
    FPS.calc();

    //world.update(FPS.delta);
    r.clear();
    if(bird){
        camera.loc = bird.loc.Angular2Analitic().inverse();
        camera.setRota(-bird.loc.x/Math.PI*180-90);
    }
    world.draw(r);
    r.text("ALPHA TEST",5,20)
    r.text("FPS: " + FPSslow+" %"+Math.floor(renderKalite*100),5,50);
    r.text("UPS: " + UPSslow,5,70);
    r.text("ping: " + ping,5,90);
    r.text("r: " + bird.loc.x,5,110);
}

var topFPS=SABITLER.FPS,FPScount= 1,FPSbf=SABITLER.FPS;

setInterval(function(){
    FPSslow = FPS.FPS;
    UPSslow = UPS;
    if(created){
        topFPS+=FPSslow;
        FPScount++;
    }


},500);

var PINGstartTime;
setInterval(function() {
    if(socket){
        console.log("ping")
        PINGstartTime = Date.now();
        socket.emit("p");
    }
}, 5000);


setInterval(function(){
    topFPS = topFPS/FPScount;
    renderKalite = Math.min(SABITLER.FPS,topFPS)/SABITLER.FPS;
    if(Math.abs(topFPS-FPSbf)>5){
        FPSbf=topFPS;
        r.canvas.width = window.innerWidth*renderKalite;
        r.canvas.height = window.innerHeight*renderKalite;
    }
    topFPS*=FPScount;
},15000);


