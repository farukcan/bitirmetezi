//	#
//	#	*** evolution.js ***
//	#

//	#	by Faruk CAN ( farukcan.net ) @ 2016
//	#	license : GNU GPL
/*

GA : object
Evolotion : class
Population : class
Member : class
Chromosome : function returns new Gene().TYPE(CHROMOSOME)
Gene : class
GenePart : class
 */



var GA = {
    defaultParameters : {
        crossing_over_rate : 0.0,
        mutation_rate : 0.5,
        population_size : 100,
        iterations : 100,
        elitism : true,
        algorithm  : 0 // GA.ALGORITHMS.STANDART
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
        SORT : 1
    },
    ALGORITHMS : {
        STANDART : 0,
        DIEANDBORN : 1
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
    crossingOverable : function(partsA,partsB){
        var r = [[],[]];

        for(var i=0; i <partsA.length; i++){
            for(var j=0; j <partsB.length; j++){
                if(partsA[i].isSameWith(partsB[j])){
                    if(partsA[i].getGene().type==partsB[j].getGene().type){
                        r[0].push(partsA[i]);
                        r[1].push(partsB[j]);
                    }
                    break;
                }
            }
        }
        return r;
    },
    crossingOver : function(chromosomeA,chromosomeB,CO_TYPE,PARTNUM_OR_UNIFORMRATE){
        var partsA = GA.splitToParts(chromosomeA);
        var partsB = GA.splitToParts(chromosomeB);
        var crossingOverable = GA.crossingOverable(partsA,partsB);
        partsA = crossingOverable[0];
        partsB = crossingOverable[1];

        switch(CO_TYPE){
            case GA.CO_TYPES.PARTIALLY:
                // 1 nokta seç , o noktadan yer değiştir
                if(partsA.length>1){
                    var i = GA.randomINT(1,partsA.length-1);
                    var A1 = partsA.slice(0,i);
                    var A2 = partsA.slice(i, partsA.length);
                    var B1 = partsB.slice(0,i);
                    var B2 = partsB.slice(i, partsB.length);
                    partsA = B1.concat(A2);
                    partsB = A1.concat(B2);
                }
                break;
            case GA.CO_TYPES.MULTIPARTIALLY:
                var PARTNUM = PARTNUM_OR_UNIFORMRATE;
                if(partsA.length>PARTNUM){
                    var partition = [];
                    var sum = PARTNUM;
                    var num=sum;
                    while(num--) partition.push(1);

                    while((sum<partsA.length-1) && GA.chance(0.5)){
                        partition[GA.randomINT(0,partition.length-1)]++;
                        sum++;
                    }

                    var partitionIndex= 0;
                    var mode = true;
                    for(var i=0; i < partsA.length;i++){

                        if(mode){
                            var swap = partsA[i];
                            partsA[i] = partsB[i];
                            partsB[i] = swap;
                        }
                        if(typeof partition[partitionIndex] != 'undefined'){
                            partition[partitionIndex]--;
                            if(partition[partitionIndex]==0) {
                                mode = !mode;
                                partitionIndex++;
                            }
                        }
                    }

                }
                // yukardakini birkaç noktadan yap
                break;
            case GA.CO_TYPES.UNIFORM:
                // sanşsa göre parçaları değiştir.
                for(var i=0; i < partsA.length;i++){
                    if(GA.chance(PARTNUM_OR_UNIFORMRATE)){
                        var swap = partsA[i];
                        partsA[i] = partsB[i];
                        partsB[i] = swap;
                    }
                }
                break;
        }

        if(GA.chance(0.5)){
            // swap parts
            var swap = partsA;
            partsA = partsB;
            partsB = swap;
        }

        var childA = GA.copyGene(chromosomeA);
        var childB = GA.copyGene(chromosomeB);

        partsA.forEach(function(part){
            var gene = part.getGene(childA);
            gene.val = part.getGene().val;
        });

        partsB.forEach(function(part){
            var gene = part.getGene(childB);
            gene.val = part.getGene().val;
        });


        return [childA,childB]; // iki kromozom döndür.
    },
    crossingOverRULED : function(chromosomeA,chromosomeB,CO_TYPE,PARTNUM_OR_UNIFORMRATE){
        var r = GA.crossingOver(chromosomeA,chromosomeB,CO_TYPE,PARTNUM_OR_UNIFORMRATE);
        if(r[0].RULEfunc) r[0].RULEfunc(r[0].val);
        if(r[1].RULEfunc) r[1].RULEfunc(r[1].val);

        return r;
    }
};

function Evolotion(fitnessFunc,createFunc){
    this.population;
    this.fitnessFunction = fitnessFunc; // f(member)
    this.parameters = GA.defaultParameters;
    this.createPopulation = createFunc;
}

Evolotion.prototype = {
    setParameters : function(param){
        for(key in param){
            this.parameters[key] = param[key];
        }
        return this;
    },
    start : function(){
        this.createPopulation();
        switch (this.parameters.algorithm){
            case GA.ALGORITHMS.STANDART:
                this.population.calcFitness();
                var iteration=0;
                while(iteration<this.parameters.iterations){
                    this.population.selection();

                    this.population.calcFitness();
                    iteration++;
                }
                break;

            case GA.ALGORITHMS.DIEANDBORN:

                break;
        }
    }
};


function Population(evo){
    this.members = [];
    this.evolotion=evo;
    this.avgFitness;
    this.maxFitness;
    this.minFitness

    evo.population = this;
}

Population.prototype = {
    calcFitness : function(){
        this.avgFitness=0;
        this.maxFitness=-1e+99;
        this.minFitness=1e+99;
        var _this=this;
        this.members.forEach(function(member){
            member.fitness = this.evolotion.fitnessFunction(member);
            _this.avgFitness+=member.fitness;
            _this.maxFitness = Math.max(_this.maxFitness,member.fitness);
            _this.minFitness = Math.min(_this.minFitness,member.fitness);
        });
        _this.avgFitness/=this.members.length;
    }
};

function Member(Population){
    this.generation=0;
    this.chromosome;
    this.fitness;
    this.population=Population;

    Population.push(this);
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

                this.chg_rate = GA.defaultParameters.mutation_rate;
                this.ins_rate = GA.defaultParameters.mutation_rate;
                this.rmv_rate = GA.defaultParameters.mutation_rate;
                this.swp_rate = GA.defaultParameters.mutation_rate;

                this.VAL("evolution.js");
                break;
            case GA.TYPE.CHROMOSOME:
                this.VAL({});
                this.CHG(true);

                this.ins_rate = GA.defaultParameters.mutation_rate;
                this.rmv_rate = GA.defaultParameters.mutation_rate;
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
    MUTATION_RATE : function(r){ this.mutation_rate=r;return this;},
    CHG_RATE : function(r){ this.chg_rate=r;return this;},
    INS_RATE : function(r){ this.ins_rate=r;return this;},
    RMV_RATE : function(r){ this.rmv_rate=r;return this;},
    SWP_RATE : function(r){ this.swp_rate=r;return this;},
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
    getGene : function(from){
        var current = typeof from != 'undefined' ? from : this.root;
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