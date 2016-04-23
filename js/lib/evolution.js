/**
 * Created by Can on 21.4.2016.
 */
function Evolotion(){
    this.fitnessFunction;
    this.population;
    this.generation;
}

function Population(){
    this.members = [];
    this.avgFitness;
    this.maxFitness;
    this.minFitness
}

function Chromesome(){
    this.genes = [];
    this.fitness;
}

function Gene(type,val){
    this.type = type;
    this.val = val ? val : this.setRandom(this.type);
}

Gene.prototype = {
    mutate : function(){
        switch(this.type){

        }
    },
    setRandom : function(type){
        switch(this.type){

        }
    }
};

Gene.TYPE = {
    UNIPOLAR : 0,
    BIPOLAR : 1,
    STRING : 2
};