/**
 * Created by Can on 16.5.2016.
 */

var fitnessFonksiyonu = function(member){

};

var baslangicFonksiyonu = function(){

};

var evrim = new Evolotion(fitnessFonksiyonu,baslangicFonksiyonu);

evrim.setParameters({
    algorithm : GA.ALGORITHMS.DIEANDBORN
});

evrim.createPopulation();

evrim.start();