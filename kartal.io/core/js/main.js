/**
 * Created by Can on 8.4.2016.
 */

var r = new CanvasRender("mainCanvas");
r.font("50px Arial")
// çözünürlük
var renderKalite = 1;
r.canvas.width = window.innerWidth*renderKalite;
r.canvas.height = window.innerHeight*renderKalite;

// world
var world;
var camera;
var bird;
var highscore=0;
var socket;
var zoom=r.canvas.width/r.canvas.height;

// debug mode
var debug = true;



var imgbird = r.loadImage("img/kartal.svg");

r.loadSVG("img/kartal.svg",imgbird);

r.addClickListener(fly,[{
    top : 0,
    left : 0,
    height : r.canvas.height/8,
    width : r.canvas.width,
    func : nitro
}]);

$("#score").click(nitro);
r.canvas.oncontextmenu = function() {
    nitro();
    return false;
}
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
            zoom-=0.03;
            break;
        case 109:
            zoom+=0.03;
            break;
        case 13:
            create();
            break;
        case 38: //up
        case 32: //space
            fly();
            break;
        case 39: // left
        case 40: // right
        case 37:
        case 17: //ctrl
            nitro();
            break;
        default:
            console.log(e.keyCode);
            return; // exit this handler for other keys
    }
    //e.preventDefault();
    return true;
});

function fly(){
    if(socket)
        socket.emit("fly");
}

var lastNitro = Date.now();
function nitro(){
    if(socket){
        socket.emit("nitro");
        if(lastNitro+5000<Date.now())
            lastNitro = Date.now();
    }
}

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
        socket.on('hp',function(hp){
            console.log("#hp",hp);
            bird.hp = hp;
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
        highscore = Math.max(highscore,Math.floor(bird.size)*10);
        $("#score").html("High Score<h1>"+highscore+"</h1>");

        socket = null;
        world = null;
        camera = null;
        bird = null;
    }


}

var FPS = new FPSCalculator(),FPSslow=60,UPSslow=60,ping=16,nitropercent;
function update(){
    FPS.calc();

    //world.update(FPS.delta);
    r.clear();
    if(bird){
        camera.loc = bird.loc.Angular2Analitic().inverse();
        camera.setRota(-bird.loc.x/Math.PI*180-90);
        camera.scale = 40/bird.size*zoom;
    }
    world.draw(r);
    nitropercent = r.canvas.width*limit(((lastNitro+5000)-Date.now())/5000,0,1);
    r.fillStyle('red');
    r.rect(0,0,nitropercent , 5);

    if(debug){
        r.color("white")
        r.text("ALPHA TEST",5,20)
        r.text("FPS: " + FPSslow+" %"+Math.floor(renderKalite*100),5,50);
        r.text("UPS: " + UPSslow,5,70);
        r.text("ping: " + ping,5,90);
        r.text("r: " + bird.loc.x,5,110);
    }


    r.color("#EF7126");
    r.rect(0,r.canvas.height-5,r.canvas.width,5);
    r.color("#F9E559");
    r.rect(0,r.canvas.height-5,bird.hp/bird.size*r.canvas.width,5);
    //;

}
function full(){
    document.requestFullscreen();
}


var topFPS=SABITLER.FPS,FPScount= 1,FPSbf=SABITLER.FPS;

setInterval(function(){
    FPSslow = FPS.FPS;
    UPSslow = UPS;
    if(created){
        topFPS+=FPSslow;
        FPScount++;
        if(nitropercent==0)
            $("#score").html("Score<h1>"+Math.floor(bird.size*10)+"</h1>Click me!");
        else
            $("#score").html("Score<h1>"+Math.floor(bird.size*10)+"</h1>");
    }


},500);

var PINGstartTime;
setInterval(function() {
    if(socket){
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


