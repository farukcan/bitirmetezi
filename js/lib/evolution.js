/**
 * Created by Can on 21.4.2016.
 */

var GA = {
    defaultParameters : {
        crossing_over_rate : 0.0,
        mutation_rate : 0.5,
        population_size : 100,
        real_timed  : false,
    },
}

function Evolotion(){
    this.fitnessFunction;
    this.population;
    this.parameters;
}

function Population(){
    this.members = [];
    this.avgFitness;
    this.maxFitness;
    this.minFitness
}

function Member(){
    this.generation;
    this.chromosome;
    this.fitness;
}

function Chromesome(){
    this.genes = [];
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