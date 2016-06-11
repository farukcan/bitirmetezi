var 
 ayar = require("./ayar.js"), //ayarlar burda
 http = require('http'), //http protokolune ata
 fs = require('fs-extra'),
 base64 = require('base-64');
var validator = require('validator');




  /*
  |--------------------------------------------------------------------------
  | Kendini yeniden başlatma farkındalığı.
  |--------------------------------------------------------------------------
  | kaynak kod değiştimi kendini kapatır. 
  | 
  */
  var watchList = ["app.js","ayar.js"];

  watchList.forEach(function(file){
      fs.watchFile(file,function(shuanki,xonceki){
          ctt("Kaynak Kod Değişti, kapatılıyor...");
          kapat();
      });
  });


  function kapat () {
    process.exit(1);
    throw new Error("app.js kapatıldı");
  }


  /*
  |--------------------------------------------------------------------------
  | Konsol Input
  |--------------------------------------------------------------------------
  |
  | 
  */

  var sys = require("sys");
  var stdin = process.openStdin();
  stdin.addListener("data", function(d) {
      // note:  d is an object, and when converted to a string it willd
      // end with a linefeed.  so we (rather crudely) account for that  
      // with toString() and then substring() 
      cmd(d.toString().substring(0, d.length-2));
  });


  /*
  |--------------------------------------------------------------------------
  | Konsol
  |--------------------------------------------------------------------------
  | app.js ye text komut gönderme ve sonuç alma amaçlanır.
  | 
  */

  function cmd (d) {
    cmdList.every( function(kmt){
          if(d.indexOf(kmt.cmd)==0){
            kmt.fun(d.split(" "));
            return false;
          }
          return true;
    });
  }

  var cmdList = [];

  function Cmd (cmd,fun,help) {
    this.cmd = cmd;
    this.fun = fun;
    this.help = help;
  }

  function cmdAdd (cmd,fun,help) {
    if(help)
      cmdList.push(new Cmd(cmd,fun,help));
    else
      cmdList.push(new Cmd(cmd,fun,"Yok"));
  }

  cmdAdd("elveda",function (dat) {
    kapat();
  },"app kapatır");

  cmdAdd("build",function (dat) {
    buildGame();
  },"build game");
cmdAdd("remotebuild",function (dat) {
    build4remote();
},"build game");
    cmdAdd("conn",function (dat) {
        ct("connections :"+controller.connections.length);

    },"conn s");
  cmdAdd("help",function () {
    ctt("Komut Listesi");
    cmdList.every( function(kmt){
          ct(kmt.cmd + "\t : \t" +kmt.help);
          return true;
    });
  },"Komutlar hakkında yardım fonksiyonudur.");


/*
|--------------------------------------------------------------------------
| Konsol kısaltma fonksiyonları
|--------------------------------------------------------------------------
|
|
*/
    function c(tt){console.log(tt);}
    function ct(tt){console.log("# > "+tt);}
    function ctt(tt){c("# ----------");ct(tt);c("# ----------")}


/*
 |--------------------------------------------------------------------------
 | email gönderici
 |--------------------------------------------------------------------------
 |
 |
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailer = nodemailer.createTransport(smtpTransport(ayar.mail));
var outlogFile = "-NO LOG-";
var errlogFile = "-NO LOG-";
var loglogFile = "-NO LOG-";
try{
    outlogFile = fs.readFileSync("out.log").toString()/*.replace(/\n/g, "<br />")*/;
    errlogFile = fs.readFileSync("err.log").toString()/*.replace(/\n/g, "<br />")*/;
    loglogFile = fs.readFileSync("log.log").toString()/*.replace(/\n/g, "<br />")*/;
    /*fs.unlinkSync("out.log");
    fs.unlinkSync("err.log");
    fs.unlinkSync("log.log");*/

}
catch (e){
    console.log('Unable to open log files');
}
mailer.sendMail({
    from: ayar.mailAdresi,
    to: ayar.adminMail,
    subject: 'kartal.io - Server',
    html: "<h1>kartal.io, restarted</h1> "+Date()+"<h2>err.log</h2>"+errlogFile+ "<h2>out.log</h2>"+outlogFile+ "<h2>log.log</h2>"+loglogFile
},function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Eposta gonderme basarili: ' + info.response);

});


/*
 |--------------------------------------------------------------------------
 | js kütüphanelerini yükle
 |--------------------------------------------------------------------------
 |
 |
 */

    eval(fs.readFileSync("../../js/lib/Vec2.js", 'utf8'));
    eval(fs.readFileSync("../../js/lib/RGB.js", 'utf8'));
    eval(fs.readFileSync("js/Sabitler.js", 'utf8'));
    eval(fs.readFileSync("js/FPS.js", 'utf8'));
    eval(fs.readFileSync("js/Bird.js", 'utf8'));
    eval(fs.readFileSync("js/Food.js", 'utf8'));
    eval(fs.readFileSync("js/World.js", 'utf8'));
    eval(fs.readFileSync("js/Connection.js", 'utf8'));
    eval(fs.readFileSync("js/Server.js", 'utf8'));

/*
 |--------------------------------------------------------------------------
 | game.js Builder
 |--------------------------------------------------------------------------
 |
 |
 */

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;


// game.js için birleştirilip, build edilecek dosyaların listesidir.
 var buildList = [
     '../../js/lib/CanvasRender.js',
     '../../js/lib/jquery-min.js',
     '../../js/lib/Vec2.js',
     '../../js/lib/RGB.js',
     '../../js/lib/buzz.min.js',
     'node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
     'js/Sabitler.js',
     'js/FPS.js',
     'js/Bird.js',
     'js/Food.js',
     'js/Camera.js',
     'js/Asset.js',
     'js/Duman.js',
     'js/World.js',
     'js/main.js'
 ];

// her açılışta game.jsyi oluştur
buildGame();


// her dosya değiştiğinde tekrar build et
    buildList.forEach(function(file){
        fs.watchFile(file,function(shuanki,xonceki){
            ct("File Changed : "+file);
            buildGame();
        });
    });


 function buildGame(){
     // bu fonksiyono clientlar için game.js dosyasını build eder. Bunu yaparken belirli dosyaları birleştirir ve optimize eder.
     var data = "kartalsvgdata='"+base64.encode(fs.readFileSync("sayfalar/img/kartal.svg").toString())+"';";

     buildList.forEach(function(file){
         data+=fs.readFileSync(file).toString();
     });


     if(ayar.uglyjs){
         var ast = jsp.parse(data); // parse code and get the initial AST
         ast = pro.ast_mangle(ast); // get a new AST with mangled names
         ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
         data = pro.gen_code(ast); // compressed code here
     }


     fs.writeFile("./sayfalar/game.js", data, function(err) {
         if(err) {
             return console.log(err);
         }
         ct("game.js builded!");
     });
 }

function build4remote(){
    var data = "kartalsvgdata='"+base64.encode(fs.readFileSync("sayfalar/img/kartal.svg").toString())+"';";

    buildList.forEach(function(file){
        data+=fs.readFileSync(file).toString();
    });
    data= data.replace("/*BUILD-REMOTE-HOST*/","'"+ayar.host+"'");

    // sıkıştır
    var ast = jsp.parse(data); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    data = pro.gen_code(ast); // compressed code here

    var dir = SABITLER.VERSION + "-remote"+Date.now();

    fs.mkdirsSync('./build/'+dir+'/');
    fs.copy('./sayfalar/', './build/'+dir+'/', function (err) {
        if (err) return console.error(err)
        fs.writeFile("./build/"+dir+"/game.js", data, function(err) {
            if(err) {
                return console.log(err);
            }
            ct("builded for remote : /build/"+dir);
        });
    });

}

/*
 |--------------------------------------------------------------------------
 | HTTP sunucu
 |--------------------------------------------------------------------------
 |
 |
 */

var sunucu = http.createServer(function(istek,cevap){
    if(istek.url.indexOf("?")>0){
        var a = istek.url.split("?");
        istek.url = a[0];
        istek.getData =  a[1];
    }

    if(istek.url.indexOf("installer")>0){
        fs.readFile("." + istek.url,function(hata,veri){
            if(hata){ // dosya okunamazsa
                ct("404 : " + istek.url);
                cevap.writeHead(404,{
                    "Content-type":"text/plain"
                }); // head
                cevap.end("404 NOT FOUND");

            }
            else{
                if(istek.url.indexOf(".css")>-1)
                    cevap.writeHead(200,{"Content-type":"text/css"}); // html sayfası
                else if(istek.url.indexOf(".svg")>-1)
                    cevap.writeHead(200,{"Content-type":"image/svg+xml"}); // svg sayfası
                else if(istek.url.indexOf(".ogg")>-1)
                    cevap.writeHead(200,{"Content-type":"audio/ogg"}); // ogg sayfası
                else
                    cevap.writeHead(200,{"Content-type":"text/html"}); // html sayfası
                cevap.end(veri);
            }
        });

        return;
    }

    switch (istek.url){
        case "/":
            istek.url = "/index.html";
            fs.readFile("./sayfalar" + istek.url,function(hata,veri){
                if(hata){}else{
                    cevap.writeHead(200,{"Content-type":"text/html"}); // html sayfası
                    cevap.end(veri);
                }
            });
            break;
        case "/statics":
            var files = fs.readdirSync("logs");
            files.reverse();
            var veri = "";
            files.forEach(function(file){
                veri += fs.readFileSync("logs/"+file).toString();
            });
            veri = veri.split("{").join("{<blockquote>").split("}").join("</blockquote>}").split(",").join(",<br>");
            cevap.writeHead(200,{"Content-type":"text/html"}); // html sayfası
            cevap.end(veri);
            break;
        case "/deletestatics":
            var files = fs.readdirSync("logs");
            files.reverse();
            files.forEach(function(file){
                fs.unlinkSync("logs/"+file);
            });
            cevap.writeHead(200,{"Content-type":"text/html"}); // html sayfası
            cevap.end("ok - deleted");
            break;
        default:
            fs.readFile("./sayfalar" + istek.url,function(hata,veri){
                if(hata){ // dosya okunamazsa
                    ct("404 : " + istek.url)
                    cevap.writeHead(404,{
                            "Content-type":"text/plain"
                        }); // head
                        cevap.end("404 NOT FOUND");

                }
                else{
                    if(istek.url.indexOf(".css")>-1)
                        cevap.writeHead(200,{"Content-type":"text/css"}); // html sayfası
                    else if(istek.url.indexOf(".svg")>-1)
                        cevap.writeHead(200,{"Content-type":"image/svg+xml"}); // svg sayfası
                    else if(istek.url.indexOf(".ogg")>-1)
                        cevap.writeHead(200,{"Content-type":"audio/ogg"}); // ogg sayfası
                    else
                        cevap.writeHead(200,{"Content-type":"text/html"}); // html sayfası
                    cevap.end(veri);
                }
            });
    }
});

// http dinlemeyi başlat
sunucu.listen(ayar.port, function(){
    ct('HTTP dinleniyor : port:'+ayar.port);
});


/*
 |--------------------------------------------------------------------------
 | Socket io
 |--------------------------------------------------------------------------
 |
 |
 */

io = require('socket.io')(sunucu);

var controller = new ConnectionController();

io.on('connection', function(socket){
    var conn = controller.addConnection(socket);
    var bird=false;
    var spectator = false;

    socket.on('disconnect', function(neden){
        ct(conn.name+" is disconnected");
        conn.disconnect(bird);
    });
    socket.on('hi',function(name,way,version){
        if(SABITLER.VERSION!=version) socket.emit("alert","Please update the game, your version is decrepited");
        if(bird) return;
        bird = birdCreator(way);
        bird.conn = conn;
        bird.lastFly=Date.now();
        bird.flyable = function(){
            return (this.lastFly+75)<Date.now();
        };
        bird.lastNitro=Date.now()-5000;
        bird.nitroable = function(){
            return (this.lastNitro+5000)<Date.now() && this.size>15;
        };

        if(typeof name == "string"){
            conn.name=validator.escape(name).substring(0,18);

            // Game Master Modu
            if(name=="ben bu oyunu bozarım"){
                conn.name="[GM] F A R U K  C A N";
                bird.size = SABITLER.MAXSIZE;
                bird.hp = SABITLER.MAXSIZE;
            }

        }
        bird.ad=conn.name;
        world.addBird(bird);
        statics.playedgames++;
        ct(conn.name+" is connected");
    });

    socket.on('spectator',function(){
        conn.sendBirds(world,0);
        spectator = true;
    });

    socket.on('fly',function(){
        if(spectator) return;
        if(bird.flyable()){
            bird.fly();
        }

    });
    socket.on('nitro',function(){
        if(spectator) return;
        if(bird.nitroable()){
            bird.useNitro();
        }
    });
    socket.on('p', function() {
        socket.emit('pong');
    });
});

/*
 |--------------------------------------------------------------------------
 | Fizikler Dünya
 |--------------------------------------------------------------------------
 |
 |
 */
var gameloop = require('node-gameloop');


var world = new World();
world.server.io = io;

foodCreator(); // ilk yemleri oluştur

gameloop.setGameLoop(update, 1000 / SABITLER.FPS);

function update(delta){
    world.update(delta*1000);
    controller.update(world); // send rt data to players
}

// 2snde bir kuşlar iyileşir.
setInterval(function(){
    world.birds.forEach(function(bird,i){
        bird.heal();
    });
},2000);

// LOG - istatiksel kayıtlar...
var loggerfile = "logs/D"+Date.now()+".txt";
var statics = {
    start : Date().toString(),
    playedgames : 0,
    maxscore : 0,
    maxscoread : "yok",
    maxplayer : 0
};

// 10snde bir : Scoreboardı günceller
setInterval(function(){
    var scores = [];
    world.birds.forEach(function(bird,i){
        scores.push({
            "ad" : bird.ad,
            "score" : Math.floor(bird.size*10)
        });
    });
    scores.sort(function(a, b){return b.score- a.score});
    statics.maxplayer = Math.max(statics.maxplayer,scores.length);
    scores.splice(10, scores.length);
    if(scores[0] && statics.maxscore < scores[0].score){
        statics.maxscore = scores[0].score;
        statics.maxscoread = scores[0].ad;
    }
    fs.writeFile(loggerfile, JSON.stringify(statics)+JSON.stringify(scores), function (err) {
        if (err)
            return console.log(err);
    });
    world.server.io.emit('scores',scores);
},10000)


function birdCreator(way){
    if(typeof way != "undefined"){ // kuşun yöne atanmadıysa kendi ata
        if(way==1) return new Bird(Math.random()*Math.PI*2,world.earthR+world.atmosphere/3+Math.random()*world.atmosphere/2,true);
        if(way==-1) return new Bird(Math.random()*Math.PI*2,world.earthR+world.atmosphere/3+Math.random()*world.atmosphere/2,false);
    }
    return new Bird(Math.random()*Math.PI*2,world.earthR+world.atmosphere/3+Math.random()*world.atmosphere/2,world.leftCount>world.rightCount);
}
function foodCreator(){ // rastgele yerlerde FOODNUM kadar yem oluştur.
    for(var i=0;i<SABITLER.FOODNUM;i++){
        world.addFood(new Food(Math.random()*Math.PI*2,world.earthR+Math.random()*world.atmosphere));
    }
}

if(ayar.YZ) // if AI enabled
    eval(fs.readFileSync("js/YapayZeka.js", 'utf8'));