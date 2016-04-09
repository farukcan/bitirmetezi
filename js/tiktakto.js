/**
 * Created by Faruk Can on 6.4.2016.
 */

var ç = new CanvasRender("canvas1");

var canvasboyut = 500;

var tahta = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];
// 1 : X
// diğer : O
// 0 : boş



// kontrol mekanizması
ç.addClickListener(function(x,y){
    console.log(x,y);
});
var hamleyapmakiçinarray = [];
for(var m=0;m<3;m++)
    for(var n=0;n<3;n++){
        hamleyapmakiçinarray.push({
            "height" : canvasboyut/3,
            "width" : canvasboyut/3,
            "top" : canvasboyut/3*m,
            "left" : canvasboyut/3*n
        });
    }
hamleyapmakiçinarray[0].func = function (){hamleyap(0,0)};
hamleyapmakiçinarray[1].func = function (){hamleyap(0,1)};
hamleyapmakiçinarray[2].func = function (){hamleyap(0,2)};
hamleyapmakiçinarray[3].func = function (){hamleyap(1,0)};
hamleyapmakiçinarray[4].func = function (){hamleyap(1,1)};
hamleyapmakiçinarray[5].func = function (){hamleyap(1,2)};
hamleyapmakiçinarray[6].func = function (){hamleyap(2,0)};
hamleyapmakiçinarray[7].func = function (){hamleyap(2,1)};
hamleyapmakiçinarray[8].func = function (){hamleyap(2,2)};
ç.clickElement = hamleyapmakiçinarray;



// ilk durum
var oyunKimde = "X";
var sıra = 0;
tahtayıÇiz();
hamleleriÇiz(true);





function hamleyap(m,n){
    if(oyunKimde == "X" && tahta[m][n]==0){
        tahta[m][n] = 1;
        oyunKimde = "O";
        ç.clear();
        tahtayıÇiz();
        hamleleriÇiz();
        sıra++;
        if(!oyunsonu())
            setTimeout(YZhamleyap,500);
    }
}

function oyunsonu(){
    if(sıra>8) return beraber();
    var taraf = 1;
    kontrolEdilecekYerler.forEach(function(yerler){
        var kactane1var = 0;
        yerler.every(function(y){
            var n= (y-1)%3;
            var m= Math.floor((y-1)/3);
            if(tahta[m][n]*taraf==-1) {
                kactane1var=0;
                return false;
            }
            if(tahta[m][n]*taraf==1) kactane1var++;
            return true;
        });
        if(kactane1var==3) {
            Xkazandı();
        }
    });
    var taraf = -1;
    kontrolEdilecekYerler.forEach(function(yerler){
        var kactane1var = 0;
        yerler.every(function(y){
            var n= (y-1)%3;
            var m= Math.floor((y-1)/3);
            if(tahta[m][n]*taraf==-1) {
                kactane1var=0;
                return false;
            }
            if(tahta[m][n]*taraf==1) kactane1var++;
            return true;
        });
        if(kactane1var==3) {
            Okazandı();
        }
    });

}

function Xkazandı(){
    alert("X kazandı");
    reload();
}
function Okazandı(){
    alert("O kazandı");
    reload();
}
function beraber(){
    alert("Berabere");
    reload();
}

function reload(){
    setTimeout(function(){location.reload();},2000);
}


var kontrolEdilecekYerler = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
];

// # tek taraf sezgisel fonksiyon h2
// -- her satır, sutun ve 2çarpraz için
// --- Eğer -1 varsa : 0 puan
// --- Eğer 1 tane 1 varsa : 1 puan
// --- Eğer 2 tane 1 varsa : 3 puan
// --- Eğer 3 tane 1 varsa : 99 puan
function h2(taraf,durum){
    var puan=0;
    kontrolEdilecekYerler.forEach(function(yerler){
        var kactane1var = 0;
        yerler.every(function(y){
            var n= (y-1)%3;
            var m= Math.floor((y-1)/3);
            if(durum[m][n]*taraf==-1) {
                kactane1var=0;
                return false;
            }
            if(durum[m][n]*taraf==1) kactane1var++;
            return true;
        });
        if(kactane1var==3) puan+=999;
        else if(kactane1var==2)  puan+=3;
        else puan+=kactane1var;
    });
    return puan;
}

// rahibin sonraki el en iyi hamlesinin puanını belirle
var h3iterasyon=0;
function h3(taraf,durum){

    if(++h3iterasyon==100) return 0;

    var olasıHamleler = [];
    /*
     {
     m: (x)
     n: (y)
     h:(sayı) // hamlenin sezgisel fonksiyon değeri
     }
     */
    for(var m=0;m<3;m++)
        for(var n=0;n<3;n++){
            if(durum[m][n]==0){
                // boş olan yerlere hamle yapılabilir
                var d = JSON.parse(JSON.stringify(durum)) // dunyayı klonla
                d[m][n] = taraf; //hamleyi duruma dahil et
                olasıHamleler.push(
                    {
                        "m" : m,
                        "n" : n,
                        "h" : h(taraf,d)
                    }
                );
            }
        }

    // en iyi hamleleri sırala
    olasıHamleler.sort(function(a,b){
        return b.h - a.h;
    });
    if(typeof olasıHamleler[0] == "undefined") return 0;
    return olasıHamleler[0].h;
}

// # çift taraf sezgisel fonksiyon h
// -- h = h2 - h3
function h(taraf,durum){
    return h2(taraf,durum) - h3(-taraf,durum);
}

function YZhamleyap(){

    h3iterasyon=0;
    sıra++;

    var olasıHamleler = [];
    /*
    {
        m: (x)
        n: (y)
        h:(sayı) // hamlenin sezgisel fonksiyon değeri
    }
     */
    for(var m=0;m<3;m++)
        for(var n=0;n<3;n++){
            if(tahta[m][n]==0){
                // boş olan yerlere hamle yapılabilir
                var durum = JSON.parse(JSON.stringify(tahta)) // dunyayı klonla
                durum[m][n] = -1; //hamleyi duruma dahil et
                olasıHamleler.push(
                    {
                        "m" : m,
                        "n" : n,
                        "h" : h(-1,durum)
                    }
                );
            }
        }

    // en iyi hamleleri sırala
    olasıHamleler.sort(function(a,b){
       return b.h - a.h;
    });

    tahta[olasıHamleler[0].m][olasıHamleler[0].n] = -1;
    console.log(olasıHamleler);
    oyunKimde = "X";
    ç.clear();
    tahtayıÇiz();
    hamleleriÇiz(true);
    oyunsonu();
}


function tahtayıÇiz(){
    // tik tak to tahtası
    for(var i=1;i<3;i++){
        ç.line(canvasboyut/3*i,20,canvasboyut/3*i,canvasboyut-20);
        ç.line(20,canvasboyut/3*i,canvasboyut-20,canvasboyut/3*i);
    }

}

function hamleleriÇiz(num){
    // tahta üzerinde yazan meretler
    var sira = 0;
    for(var m=0;m<3;m++)
        for(var n=0;n<3;n++){
            sira++;
            if(tahta[m][n]==0){
                if(num){
                    ç.font(ç.standartFont);
                    ç.text(sira,canvasboyut/6+canvasboyut/3*n,canvasboyut/6+canvasboyut/3*m);
                }
            }
            else if(tahta[m][n]==1){
                ç.font("233px Arial");
                ç.text("X",canvasboyut/3*n,canvasboyut/3+canvasboyut/3*m);
            }else{
                ç.font("213px Arial");
                ç.text("O",canvasboyut/3*n,canvasboyut/3+canvasboyut/3*m-5);
            }
        }


    ç.font(ç.standartFont);
}