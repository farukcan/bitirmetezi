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
var zoom=r.canvas.width/r.canvas.height*2/3;
var fpsStabilizer = true;
$("#scoreboard").hide();
$("#playerSelectSpan").hide();
$("#playerSelect").change(function(){
    selectSpectator($(this).val());
});
var selectSpectator = function(i){
    bird.me = false;
    bird = world.birds[i];
    bird.me = true;
};
// debug mode
var debug = true;
var isSpectator = false;

var hints = [
    "Left Mouse > fly",
    "Right Mouse > fly faster",
    "Touch > fly",
    "Touch 2sc > fly faster",
    "SPACE > fly",
    "CTRL > fly faster",
    "UP key > fly",
    "LEFT key > fly faster",
    "RIGHT key > fly faster",
    "DOWN key > fly faster",
    "+ key > zoom in",
    "- key > zoom out"
],hintindex= 0,hintsenable=true;

var soundEagle = new buzz.sound("ogg/eagle.ogg");
var soundPoint = new buzz.sound("ogg/point.ogg");
var soundWing = new buzz.sound("ogg/wing.ogg");
var sounds = [soundEagle,soundPoint,soundWing]

var mute = true;
function togglemute(t){
    sounds.forEach(function(s){s.toggleMute();})
    mute=!mute;
    if(mute) t.src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjc3LjU0OSwwaC00OGwtMTQ0LDE2MGgtNDhjLTE3LjY3MiwwLTMyLjM3NSwxNC4zMjYtMzIuMzc1LDMydjEyOGMwLDE3LjY3MiwxNC43MDMsMzIsMzIuMzc1LDMyaDQ4bDE0NCwxNjBoNDggICBjOC44MzYsMCwxNS42MjUtNy4xNjQsMTUuNjI1LTE2VjE2QzI5My4xNzQsNy4xNjQsMjg2LjM4NSwwLDI3Ny41NDksMHoiIGZpbGw9IiMwMDZERjAiLz4KCTxwYXRoIGQ9Ik0zODIuNDU2LDE4Ny45MDZjLTExLjEwOS0xMy43MjctMzEuMjk3LTE1Ljg5MS00NC45NjEtNC44NDRjLTEzLjc1LDExLjA0Ny0xNS45NDEsMzEuMjM0LTQuODc5LDQ1ICAgYzExLjc3LDE0LjYyNSwxMS43Nyw0MS4yNS0wLjAwOCw1NS44ODNjLTExLjA1NSwxMy43NTgtOC44NjMsMzMuOTQ1LDQuODgzLDQ0Ljk5MmM1LjY2NCw0LjU1NSwxMi43ODEsNy4wNjMsMjAuMDQzLDcuMDYzICAgYzkuNzYyLDAsMTguODU5LTQuMzUyLDI0Ljk1My0xMS45MzhDNDEzLjE4MiwyODUuODk4LDQxMy4xODIsMjI2LjEwMiwzODIuNDU2LDE4Ny45MDZ6IiBmaWxsPSIjMDA2REYwIi8+Cgk8cGF0aCBkPSJNNDU5LjkzNiwxMzguNTc4Yy02LjQyNi02LjY2NC0xNS4wNy0xMC40MTQtMjQuMzQtMTAuNTc4Yy05LjQ3NywwLjE0MS0xOC4wMzUsMy4yOTctMjQuNjg0LDkuNzI3ICAgYy0xMy43MzgsMTMuMjY2LTE0LjEzMywzNS4yNS0wLjg2Nyw0OS4wMjNjMzYuODc5LDM4LjE4LDM2Ljg3OSwxMDAuMzEzLTAuMDE2LDEzOC41MDhjLTEzLjI1LDEzLjc1OC0xMi44NTUsMzUuNzQyLDAuODU5LDQ4Ljk4NCAgIGM2LjQ4NCw2LjI5NywxNS4wNDMsOS43NTgsMjQuMDk4LDkuNzU4YzkuMzUyLDAsMTguNDQxLTMuODUyLDI0Ljk0OS0xMC41NzhDNTIyLjQ1NiwzMDguNjcyLDUyMi40NTYsMjAzLjMyLDQ1OS45MzYsMTM4LjU3OHoiIGZpbGw9IiMwMDZERjAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K";
    else t.src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPGc+Cgk8cGF0aCBkPSJNNDYxLjI1MywyNTZsMjUuMzc1LTI1LjM3NWMxMi40OTYtMTIuNDkyLDEyLjQ5Ni0zMi43NTgsMC00NS4yNWMtMTIuNS0xMi41LTMyLjc1OC0xMi41LTQ1LjI1OCwwbC0yNS4zNzEsMjUuMzcxICAgbC0yNS4zNzEtMjUuMzcxYy0xMi41LTEyLjUtMzIuNzU4LTEyLjUtNDUuMjU4LDBjLTEyLjQ5NiwxMi40OTItMTIuNDk2LDMyLjc1OCwwLDQ1LjI1TDM3MC43NDUsMjU2bC0yNS4zNzUsMjUuMzc1ICAgYy0xMi40OTYsMTIuNDkyLTEyLjQ5NiwzMi43NTgsMCw0NS4yNWM2LjI1LDYuMjUsMTQuNDM4LDkuMzc1LDIyLjYyOSw5LjM3NXMxNi4zNzktMy4xMjUsMjIuNjI5LTkuMzc1bDI1LjM3MS0yNS4zNzEgICBsMjUuMzcxLDI1LjM3MWM2LjI1LDYuMjUsMTQuNDM4LDkuMzc1LDIyLjYyOSw5LjM3NXMxNi4zNzktMy4xMjUsMjIuNjI5LTkuMzc1YzEyLjQ5Ni0xMi40OTIsMTIuNDk2LTMyLjc1OCwwLTQ1LjI1TDQ2MS4yNTMsMjU2eiIgZmlsbD0iIzAwNkRGMCIvPgoJPHBhdGggZD0iTTI4Ny45OTksMGgtNDhsLTE0NCwxNjBoLTQ4QzMwLjMyNywxNjAsMTYsMTc0LjMyNiwxNiwxOTJ2MTI4YzAsMTcuNjcyLDE0LjMyNywzMiwzMS45OTksMzJoNDhsMTQ0LDE2MGg0OCAgIGM4LjgzNiwwLDE2LjAwMS03LjE2NCwxNi4wMDEtMTZWMTZDMzA0LDcuMTY0LDI5Ni44MzUsMCwyODcuOTk5LDB6IiBmaWxsPSIjMDA2REYwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";
}

var imgbird = [];
var kanat = r.loadImage("img/kanat.svg");
var imgtree = r.loadImage("img/agac.svg");
var imgbulut = r.loadImage("img/bulut.svg");

kartalsvgdata = $.parseXML(window.atob(kartalsvgdata));

BIRD_TYPES.forEach(function(t,i){
        kartalsvgdata.getElementById("id3").childNodes[1].setAttribute("fill", t.body.toString());
        kartalsvgdata.getElementById("id4").childNodes[1].setAttribute("fill", t.tail[0].toString());
        kartalsvgdata.getElementById("id5").childNodes[1].setAttribute("fill", t.tail[1].toString());
        kartalsvgdata.getElementById("id6").childNodes[1].setAttribute("fill", t.tail[2].toString());

        imgbird[i] = new Image;
        imgbird[i].src = "data:image/svg+xml;base64," + window.btoa((new XMLSerializer()).serializeToString(kartalsvgdata));
});


var clientConfig = {
    right : 0,
    clouds : true,
    trees : true,
    names : true,
    foodIndicator : true
};

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

$(".checkbox").click(function(){
    if(this.checked)
        eval($(this).attr("boolvar")+"=true;")
    else
        eval($(this).attr("boolvar")+"=false;")
});

$("#flyingway").change(function(){
   clientConfig.right = $( "#flyingway option:selected").val();
});

$(document).keydown(function(e){
    switch(e.keyCode) {
        case 107:
            zoomin();
            break;
        case 109:
            zoomout();
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
    return true;
});

function fly(){
    if(socket && !isSpectator){
        socket.emit("fly");
        soundWing.stop();
        soundWing.play();
    }
}

var lastNitro = Date.now();
function nitro(){
    if(socket && !isSpectator){
        socket.emit("nitro");
        soundEagle.play();
        $("#score").css("background-color","transparent");
        if(lastNitro+5000<Date.now())
            lastNitro = Date.now();
    }
}

var zoomspeed=0.09;
function zoomin(){
    zoom+=zoomspeed;
}
function zoomout(){
    zoom-=zoomspeed;
    zoom = Math.max(0.01,zoom);
}
var created,UPS,UPScache= 0,Udelta;
function create(){
    if(!created){

        $("#gameInfo").hide();
        if(!isSpectator){
            $("#rules").hide();
            $("#settings").hide();
        }else{
            $("#playerSelectSpan").show();
        }


        world = new World();

        var sz;
        for(var i=0;i<50;i++){
            sz = (Math.random()*7+2);
            if(clientConfig.trees)
                world.assets.push(new Asset(Math.random()*Math.PI*2,world.earthR+15*sz,19*sz,30*sz,imgtree));
            if(clientConfig.clouds)
                world.assets.push(new Asset(Math.random()*Math.PI*2,world.earthR+world.atmosphere*2/3+world.atmosphere/2*Math.random(),(45+Math.random()*30)*sz,30*sz,imgbulut));
        }

        socket = io(/*BUILD-REMOTE-HOST*/);


        if(isSpectator){
            socket.emit("spectator");
        }else{
            socket.emit("hi",$("#nick").val(),clientConfig.right,SABITLER.VERSION);

        }

        var updatePlayerSelect = function(){
            $("#playerSelect").html("");

            world.birds.forEach(function(bird,i){
                $("#playerSelect").append($('<option>', {
                    value: i,
                    text: bird.ad
                }));
            });

        };

        socket.on("disconnect",destroy);
        socket.on("addBird",function(b){
            console.log("#addBird",b);
            var bird = new Bird(b.locx, b.locy, b.right);
            bird.ad = b.ad;
            bird.tip = b.tip;
            world.addBird(bird, b.i);
            if(isSpectator)
                updatePlayerSelect();
        });
        socket.on("youare",function(i){
            console.log("#youare",i);
           bird = world.birds[i];
           bird.me = true;

        });
        socket.on("removeBird",function(i){
            console.log("#removeBird",i);
            if(isSpectator)
                var me = world.birds[i].me;
            world.removeBird(i);
            if(isSpectator){
                if(me) selectSpectator(0);
                updatePlayerSelect();
            }
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
        socket.on("alert",function(s){
            destroy();
            alert(s);
        });
        socket.on('scores',function(scores){
           var h = "<tr><th>Score</th><th>Nick</th></tr>";
            scores.forEach(function(s){
                console.log("#scores",s);
                h+="<tr><td>"+ s.score +"</td><td>"+ s.ad+"</td></tr>";
            });
            $("#scoreboard").html("<table>"+h+"</table>");
            $("#scoreboard").show();
        });

        socket.on('duman',function(dat){
            console.log("#duman",dat);
            world.dumanlar.push(new Duman(dat.x,dat.y,dat.vx,dat.vy,dat.vr));
        });
        socket.on('invisible', function (i) {
            console.log("#invisible",i);
            if(world.birds[i])
                world.birds[i].visible=false;
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
        $("#scoreboard").fadeOut(5000);
        $("#settings").fadeIn();

        r.removeUpdateFunc();
        try{
            socket.emit("disconnect");
            socket.disconnect();
        }catch(err){}
        if(bird) highscore = Math.max(highscore,Math.floor(bird.size)*10);
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
        camera.scale = 30/bird.size*zoom;
    }
    world.draw(r);
    nitropercent = r.canvas.width*limit(((lastNitro+5000)-Date.now())/5000,0,1);
    r.fillStyle('red');
    r.rect(0,0,nitropercent , 5);

    if(debug){
        r.color("white")
        r.text("version : "+ SABITLER.VERSION,5, r.canvas.height-110)
        r.text("FPS: " + FPSslow+" %"+Math.floor(renderKalite*100)+" zoom:"+zoom,5, r.canvas.height-80);
        r.text("UPS: " + UPSslow,5, r.canvas.height-60);
        r.text("ping: " + ping,5, r.canvas.height-40);
    }


    r.color("#EF7126");
    r.rect(0,r.canvas.height-5,r.canvas.width,5);
    r.color("#F9E559");
    if(bird){
        r.rect(0,r.canvas.height-5,bird.hp/bird.size*r.canvas.width,5);
        r.strokeStyle("white");
        r.circle(r.canvas.width-75,r.canvas.height-75,50);
        r.circle(r.canvas.width-75,r.canvas.height-75,Math.max(Math.floor((bird.loc.y-world.earthR)/world.atmosphere*50),1));
        r.color("white");
        r.fill();
        r.circle(r.canvas.width-75+Math.cos(bird.loc.x)*50,r.canvas.height-75+Math.sin(bird.loc.x)*50,10);
        r.fill();
    }


}
function full(){
    document.requestFullscreen();
}


var topFPS=SABITLER.FPS,FPScount= 1,FPSbf=SABITLER.FPS;

setInterval(function(){
    if(created){
        topFPS+=FPSslow;
        FPScount++;
    }


},1000);

var oncekiSize=0;
setInterval(function(){
    FPSslow = FPS.FPS;
    UPSslow = UPS;
    if(created && bird){
        if(nitropercent==0 && !isSpectator){
            $("#score").html("Score<h1>"+Math.floor(bird.size*10)+"</h1>Click me!");
            $("#score").css("background-color","rgba(255,0,0,0.03)");
            soundEagle.stop();
        }
        else
            $("#score").html("Score<h1>"+Math.floor(bird.size*10)+"</h1>"+(hintsenable ? hints[hintindex] : ""));
        $("#height").html(Math.floor((bird.loc.y-world.earthR)/10));
        if(oncekiSize<bird.size) soundPoint.stop() && soundPoint.play();
        oncekiSize = bird.size;
    }
},200);

var PINGstartTime;
setInterval(function() {
    if(socket){
        PINGstartTime = Date.now();
        socket.emit("p");
        hintindex++;
        if(hintindex==hints.length) hintindex=0;
    }
}, 5000);


setInterval(function(){
    topFPS = topFPS/FPScount;
    renderKalite = Math.min(SABITLER.FPS,topFPS)/SABITLER.FPS;
    if(fpsStabilizer && Math.abs(topFPS-FPSbf)>5){
        FPSbf=topFPS;
        r.canvas.width = window.innerWidth*renderKalite;
        r.canvas.height = window.innerHeight*renderKalite;
    }
    topFPS*=FPScount;
},15000);


