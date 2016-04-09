var 
 ayar = require("./ayar.js"), //ayarlar burda
 http = require('http'), //http protokolune ata
 fs = require('fs'),
 mysql = require('mysql'); // mysqli yükle




  /*
  |--------------------------------------------------------------------------
  | Kendini yeniden başlatma farkındalığı.
  |--------------------------------------------------------------------------
  | kaynak kod değiştimi kendini kapatır. 
  | 
  */

  fs.watchFile("app.js",function(shuanki,xonceki){
    ctt("Kaynak Kod Değişti, kapatılıyor...");
    kapat();
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
| MySQL Veritabanı
|--------------------------------------------------------------------------
|
|
*/

    var sql = mysql.createConnection(ayar.mysql); // bağlantı oluştur

    //sql.connect(); //bağlan

/*
 |--------------------------------------------------------------------------
 | js dosyaları yükle
 |--------------------------------------------------------------------------
 |
 |
 */

    eval(fs.readFileSync("../../js/lib/Vec2.js", 'utf8'));
    eval(fs.readFileSync("js/Bird.js", 'utf8'));
    eval(fs.readFileSync("js/Food.js", 'utf8'));
    eval(fs.readFileSync("js/World.js", 'utf8'));

/*
 |--------------------------------------------------------------------------
 | game.js Builder
 |--------------------------------------------------------------------------
 |
 |
 */



 var buildList = [
     '../../js/lib/CanvasRender.js',
     '../../js/lib/jquery-min.js',
     '../../js/lib/Vec2.js',
     'node_modules/socket.io/node_modules/socket.io-client/socket.io.js',
     'js/Bird.js',
     'js/Food.js',
     'js/Camera.js',
     'js/World.js',
     'js/main.js'
 ];

// her açılışta game.jsyi oluştur
buildGame();

// her dosya değiştiğinde tekrar build et
    buildList.forEach(function(file){
        fs.watchFile(file,function(shuanki,xonceki){
            buildGame();
        });
    });


 function buildGame(){
     var data = "";

     buildList.forEach(function(file){
         data+=fs.readFileSync(file).toString();
     });


     fs.writeFile("./sayfalar/game.js", data, function(err) {
         if(err) {
             return console.log(err);
         }
         ct("game.js builded!");
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
                        cevap.writeHead(200,{"Content-type":"image/svg+xml"}); // html sayfası
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

io.on('connection', function(socket){
    socket.on('hi',function(){
        ct("client says hi");
    });
});