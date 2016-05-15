//	#
//	#	*** evolution.js ***
//	#

//	#	by Faruk CAN ( farukcan.net ) @ 2016
//	#	license : GNU GPL


var GA = {
    defaultParameters : {
        crossing_over_rate : 0.0,
        mutation_rate : 0.5,
        population_size : 100,
        real_timed  : false
    },
    charSet : "ABCÇDEFGĞHIİJKLMNÖOPQRSŞTUÜVWXYZabcçdefghiığjklmnoöpqrsştüuvwxyz0123456789 .,!'^+%&/()-@æß",
    TYPE : {
        BIT : 0,
        INT : 1,
        UNIPOLAR : 2,
        BIPOLAR : 3,
        STRING : 4,
        CHROMOSOME : 5
    },
    CO_TYPES : {
        PARTIALLY : 0,
        MULTIPARTIALLY : 1,
        UNIFORM : 2
    },
    SELECTION : {
        ROULETTE : 0,
        SORT : 1,
    },
    random : function(){ return Math.random(); },
    randomINT : function(min,max) { return Math.round(Math.random()*(max-min) + min)},
    chance : function(rate) { return rate > GA.random() },
    copyGene : function(oldGene) {
        var gene = new Gene().TYPE(oldGene.type);

        for (key in oldGene)
            if (typeof oldGene[key] != 'function' && key != 'val')
                gene[key] = oldGene[key];

        if(oldGene.type==GA.TYPE.CHROMOSOME){

            if(oldGene.val instanceof Array)
                gene.val = [];
            else
                gene.val = {};

            for(key in oldGene.val){
                gene.val[key] = GA.copyGene(oldGene.val[key]);
            }
        }else{
            gene.val = oldGene.val;
        }

        if(oldGene.RULEfunc) gene.RULE(oldGene.RULEfunc);

        return gene;
    },
    INS : function(geneArray){
        var i = GA.randomINT(0,geneArray.length-1);
        var copy = GA.copyGene(geneArray[i]);
        geneArray[geneArray.length] = copy;
    },
    RMV : function(geneArray){
        if(geneArray<=0) return;
        geneArray.splice(GA.randomINT(0,geneArray.length-1),1);
    },
    SWP : function(geneArray){
        var i,j;
        do{
            i = GA.randomINT(0,geneArray.length-1);
            j = GA.randomINT(0,geneArray.length-1);
        }while(i==j && geneArray.length>1)
        var swap = geneArray[i];
        geneArray[i] = geneArray[j];
        geneArray[j] = swap;
    },
    splitToParts : function(chromosome){
        var parts = [];
        var part;

        var split = function(chromosome,way,root){
            var ROOT = typeof way == 'undefined' ? chromosome : root;
            var WAY = typeof way == 'undefined' ? [] : way;
            var parts = [];
            for(key in chromosome.val){
                if(chromosome.val[key].chg){
                    if(chromosome.val[key].type==GA.TYPE.CHROMOSOME)
                    {
                        parts = parts.concat(split(chromosome.val[key],WAY.concat([key]),ROOT));
                    }
                    else
                    {
                        parts.push(new GenePart(WAY.concat([key]),ROOT))
                    }
                }
            }
            return parts;
        };

        return split(chromosome);

    },
    crossingOver : function(chromesomeA,chromosomeB,CO_TYPE){
        var partsA = GA.splitToParts(chromesomeA);
        var partsB = GA.splitToParts(chromosomeB);
    }
};

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

function Chromosome(){
    return new Gene().TYPE(GA.TYPE.CHROMOSOME);
}

function Gene(){
    this.type = GA.TYPE.BIT;
    this.val = 0;
    this.mutation_rate = GA.defaultParameters.mutation_rate;
}

Gene.prototype = {
    mutate : function(){
        switch(this.type){
            case GA.TYPE.BIT:
                if( this.chg && GA.chance(this.mutation_rate) ){
                    this.val = this.val==0 ? 1 : 0; // 0 ve 1 yer değiştirir
                }
                break;
            case GA.TYPE.INT:
                if( this.chg && GA.chance(this.mutation_rate) ){
                    this.setRandom();
                }
                break;
            case GA.TYPE.UNIPOLAR:
                if( this.chg && GA.chance(this.mutation_rate) ){
                    this.setRandom();
                }
                break;
            case GA.TYPE.BIPOLAR:
                if( this.chg && GA.chance(this.mutation_rate) ){
                    this.setRandom();
                }
                break;
            case GA.TYPE.STRING:
                // CHG
                if(this.chg && GA.chance(this.mutation_rate)){
                    for(var i=0;i<this.val.length;i++){
                        if(GA.chance(this.chg_rate)){
                            this.val = this.val.substr(0, i) + GA.charSet.substr(GA.randomINT(0,GA.charSet.length-1), 1)+ this.val.substr(i+1);
                        }
                    }
                }

                // INS
                if(this.ins && GA.chance(this.ins_rate) && this.val.length>0){
                    var i = GA.randomINT(0,this.val.length-1);
                    this.val = this.val.substr(0, i)+ GA.charSet.substr(GA.randomINT(0,GA.charSet.length-1), 1)+ this.val.substr(i);
                }

                //RMV
                if(this.rmv && GA.chance(this.rmv_rate) && this.val.length>0 ){
                    var i = GA.randomINT(0,this.val.length-1);
                    this.val = this.val.substr(0, i)+ this.val.substr(i+1);
                }

                //SWP
                if(this.swp && GA.chance(this.swp_rate) && this.val.length>0 ){
                    var i = GA.randomINT(0,this.val.length-1);
                    var m = this.val.substr(i,1);
                    var j = GA.randomINT(0,this.val.length-1);
                    var n = this.val.substr(j,1);
                    this.val = this.val.substr(0, i) + n + this.val.substr(i+1);
                    this.val = this.val.substr(0, j) + m + this.val.substr(j+1);
                }
                break;
            case GA.TYPE.CHROMOSOME:

                    if(this.val instanceof Array){
                        var length = this.val.length;
                    }else{
                        var length = 0;
                        for(key in this.val)
                            length++;
                    }

                    if(length>0){
                        if(this.ins && GA.chance(this.ins_rate) ){
                            GA.INS(this.val)
                        }

                        if(this.rmv && GA.chance(this.rmv_rate) && length>1){
                            GA.RMV(this.val);
                        }

                        if(this.swp && GA.chance(this.swp_rate)){
                            GA.SWP(this.val);
                        }
                    }
                    if(this.chg && GA.chance(this.mutation_rate) ){
                        // kendine bağlu bütün genleri mutasyona uğrat
                        for(key in this.val){
                            this.val[key].mutate();
                        }
                    }
                    break;
        }
        if(this.RULEfunc) this.RULEfunc(this.val);
    },
    setRandom : function(){
        switch(this.type){
            case GA.TYPE.BIT:
                this.val = GA.random() > 0.5 ? 1 : 0;
                break;
            case GA.TYPE.INT:
                this.val = GA.randomINT(this.min,this.max);
                break;
            case GA.TYPE.UNIPOLAR:
                this.val = GA.random();
                break;
            case GA.TYPE.BIPOLAR:
                this.val = GA.random()*2-1;
                break;
            case GA.TYPE.STRING:
                this.val = "YOU-CANNOT-SET-RANDOM-STRING";
                break;
            // GA.TYPE.CHROMOSOME cannot set random
        }
    },
    VAL : function(value){
        if(typeof value == 'undefined'){
            this.setRandom();
        }
        else{
            this.val = value;
            if(this.type==GA.TYPE.CHROMOSOME){
                if(this.val instanceof Array){ // val is Array[]
                    this.RMV(true);
                    this.INS(true);
                    this.SWP(true);
                }
                else{ // val is object{}
                    this.RMV(false);
                    this.INS(false);
                    this.SWP(false);
                }
            }
        }


        return this;
    },
    TYPE : function(TYPE){
        this.type = TYPE;
        switch(TYPE){
            case GA.TYPE.BIT:
                this.VAL();
                this.CHG(true);
                break;
            case GA.TYPE.INT:
                this.min=-128;
                this.max=128;
                this.VAL();
                this.CHG(true);
                break;
            case GA.TYPE.UNIPOLAR:
                this.VAL();
                this.CHG(true);
                break;
            case GA.TYPE.BIPOLAR:
                this.VAL();
                this.CHG(true);
                break;
            case GA.TYPE.STRING:
                this.CHG(true);
                this.RMV(true);
                this.INS(true);
                this.SWP(true);

                // ** değiştir
                this.chg_rate = GA.defaultParameters.mutation_rate;
                this.ins_rate = GA.defaultParameters.mutation_rate;
                this.rmv_rate = GA.defaultParameters.mutation_rate;
                this.swp_rate = GA.defaultParameters.mutation_rate;

                this.VAL("evolution.js");
                break;
            case GA.TYPE.CHROMOSOME:
                this.VAL({});
                this.CHG(true);

                // ** değştir
                this.ins_rate = GA.defaultParameters.mutation_rate*0;
                this.rmv_rate = GA.defaultParameters.mutation_rate*0;
                this.swp_rate = GA.defaultParameters.mutation_rate;


                break;

        }

        return this;
    },
    MIN : function(min){ this.min=min;this.VAL();return this;},
    MAX : function(max){ this.max=max;this.VAL();return this;},
    CHG : function(bool){ this.chg=bool;return this;},
    INS : function(bool){ this.ins=bool;return this;},
    RMV : function(bool){ this.rmv=bool;return this;},
    SWP : function(bool){ this.swp=bool;return this;},
    RULE : function(func){
        this.RULEfunc = func;

        return this;
    },
    toJSON : function(){
        if(this.type==GA.TYPE.CHROMOSOME){
                if(this.val instanceof Array){ // val is Array[]
                    var r = [];
                }
                else{ // val is object{}
                    var r = {};
                }
                for(key in this.val){
                    r[key] = this.val[key].toJSON();
                }
                return r;
        }
        return this.val;
    }

};


function GenePart(way,root){
    this.parrents = way;
    this.root = root;
}

GenePart.prototype = {
    getGene : function(){
        var current = this.root;
        this.parrents.forEach(function(child){
            current = current.val[child];
        });
        return current;
    },
    isSameWith : function(genepart){
        if(this.parrents.length!=genepart.parrents.length) return false;

        for(var i = 0 ; i < this.parrents.length ; i++)
            if(this.parrents[i]!=genepart.parrents[i])
                return false;

        return true;
    }
}