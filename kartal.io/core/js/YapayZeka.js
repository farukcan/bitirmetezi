/**
 * Created by Can on 16.5.2016.
 */

// @imports
eval(fs.readFileSync("../../js/lib/ANN.js", 'utf8'));
eval(fs.readFileSync("../../js/lib/evolution.js", 'utf8'));
eval(fs.readFileSync("../../js/EVE.js", 'utf8'));

var fitnessFonksiyonu = function(member){
    return 5;
};

var baslangicFonksiyonu = function(population_size){
    new Population(this);

    while(population_size--){
        var chromo = GA.copyGene(chromosomeOfEve);
        chromo.mutate();
        new Member(this.population,chromo);
    }

};

var dogumFonksiyonu = function(member){
    // yeni bird
    var bird = birdCreator();
    bird.lastFly=Date.now();
    bird.flyable = function(){
        return (this.lastFly+75)<Date.now();
    };
    bird.lastNitro=Date.now()-5000;
    bird.nitroable = function(){
        return (this.lastNitro+5000)<Date.now() && this.size>15;
    };
    bird.ad="YZ-"+member.generation+"-"+member.id;
    world.addBird(bird);

    member.bird = bird;
    bird.member = member;
    bird.yz = true;


    // kromozomdan ysa oluştur
    var genetic = member.chromosome.toJSON();

    member.ysa = new ANN().PERCEPTRON(genetic.inputNN,genetic.hiddenNN,genetic.outputNN).setBias([-1,-1]);
    var ks = 15;
    genetic.W.forEach(function(matris){
        matris.forEach(function(satir){
            satir.forEach(function(deger,i){
                satir[i] = deger*ks;
            });
        });
    });
    member.ysa.setWeights(genetic.W);
};

var evrim = new Evolution(fitnessFonksiyonu,baslangicFonksiyonu,dogumFonksiyonu);

evrim.setParameters({
    algorithm : GA.ALGORITHMS.DIEANDBORN,
    population_size : 3,
    crossing_overMethod: GA.CO_TYPES.MULTIPARTIALLY,
    crossing_overPartNum:3,
    selectionMethod: GA.SELECTION.ROULETTE
});

evrim.start();

setInterval(function(){
    evrim.population.members.forEach(function(member){
       // member.bird //member.ysa

        var inputs = [];

        // 1 Yükseklik atmosefe oran
        // bird.loc.y-world.earthR / world.atmosphere
        input.push( (member.bird.loc.y-world.earthR)/world.atmosphere );

        // 2 Kuşun boyutu : bird.size / SABITLER.MAXSIZE
        input.push( member.bird.size / SABITLER.MAXSIZE );

        // 3 kuşun canı hp/size
        input.push( member.bird.hp / member.bird.size );

        // 4 nitro 1 0
        input.push( member.bird.nitro )

        // 5 en yakın kuşun yüksekliği

        // 6 en yakın kuşun bize göre yönü

        // 7 en yakın kuşun bize mesafesi

        // 8 en yakın kuşun boyutu

        // 9 en yakın yemin yükseliği

        // 10 en yakın yemin mesafesi

        //member.ysa.fire([1,1]);
        //member.ysa.getOutputs()

    });
},75);



