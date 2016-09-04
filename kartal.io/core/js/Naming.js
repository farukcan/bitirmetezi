/**
 * Created by can on 16.08.2016.
 */

var syllable = [];


// sesli harfler
const syllable_sesli = ["a","i","u","e","o"];

syllable=syllable.concat(syllable_sesli);


// JAPONCA
const syllable_japonca = ["shi","chi","tsu","kyo","kya","pya","nya","gya"];
syllable=syllable.concat(syllable_japonca);

const japonca_sessiz = ["k","g","s","z","t","d","n","h","b","m","y","r","w","p"];

// japonca heceleri oluştur;
syllable_sesli.forEach(function(sesli){
    japonca_sessiz.forEach(function(sessiz){
        syllable.push(sessiz+sesli);
    });
});


// LATINCE
const syllable_latin = ["tus","tis","zar","us","es","nus","cal","car","men","cus","lum","kons","tha","vis","uld","sit","lit","sum","cras"];

syllable=syllable.concat(syllable_latin);


// STAR NAMES

const syllable_star = ["if","tho","she","uzzo","valt","qi","tan","mer","ir","cron","ria","lar","alp","can","man","tal"];

syllable=syllable.concat(syllable_star);

// FANTASY

const syllable_fantasy = ["cha","kad","hin","den","ryn","god","xal","dra","byle","glor","slye","gha","el","al","az","dah","lakh","is","abu","rah","tel","ef","jib","sin","bad","nahr","kha","khan","lah"];
syllable=syllable.concat(syllable_fantasy);


function createName(){
    var name = syllable[Math.floor(Math.random()*syllable.length)];

    for(var i=0;i<5;i++){
        if(Math.random()>0.5){
            name +=syllable[Math.floor(Math.random()*syllable.length)];
        }
    }

    return name;
}
