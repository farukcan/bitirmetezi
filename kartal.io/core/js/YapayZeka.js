/**
 * Created by Can on 16.5.2016.
 */

// @imports
eval(fs.readFileSync("../../js/lib/ANN.js", 'utf8'));
eval(fs.readFileSync("../../js/lib/evolution.js", 'utf8'));
eval(fs.readFileSync("../../js/Eve.js", 'utf8'));

var fitnessFonksiyonu = function(member){
    return Math.pow(Math.max(1,member.bird.size-20),3) + Math.min(4000,(Date.now()-member.bird.bornAt)) ; // ne kadar hayatta kaldığı ve nekadar iyi beslendiğidir.
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


    member.bird = bird;
    bird.member = member;
    bird.yz = true;

    bird.starved = false;
    bird.bornAt = Date.now();


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

    bird.ad="YZ-"+member.generation+"-"+member.id+" @"+genetic.hiddenNN.toString();
    world.addBird(bird);
};

var evrim = new Evolution(fitnessFonksiyonu,baslangicFonksiyonu,dogumFonksiyonu);

evrim.setParameters({
    algorithm : GA.ALGORITHMS.DIEANDBORN,
    population_size : 9,
    crossing_overMethod: GA.CO_TYPES.MULTIPARTIALLY,
    crossing_overPartNum:3,
    selectionMethod: GA.SELECTION.ROULETTE
});

evrim.start();

setInterval(function(){
    evrim.population.members.forEach(function(member){
        // açlıktan ölme durumu
        // 10snde 0.1 büyümüş olmalı : başarı oranı 0.00001

        if(member.bird.size/(Date.now()-member.bird.bornAt) < 0.00001) member.bird.starved = true;

        if(member.bird.starved) return; // aç kalan kuş ölsün

        var input = [];

        // 1 Yükseklik atmosefe oran
        // bird.loc.y-world.earthR / world.atmosphere
        input.push( (member.bird.loc.y-world.earthR)/world.atmosphere );

        // 2 Kuşun boyutu : bird.size / SABITLER.MAXSIZE
        input.push( member.bird.size / SABITLER.MAXSIZE );

        // 3 kuşun canı hp/size
        input.push( member.bird.hp / member.bird.size );

        // 4 nitro 1 0
        input.push( member.bird.nitro ? 1 : 0 );

        var min=999999;
        var yakinBird;
        var birdLA =member.bird.loc.Angular2Analitic();
        world.birds.forEach(function(anotherBird){
            if(!anotherBird.living) return;

            var d = (birdLA.d(anotherBird.loc.Angular2Analitic()));
            if(d>1 && min>d){
                min = d;
                yakinBird = anotherBird;
            }

        });

        if(typeof yakinBird== 'undefined') return;

        // 5 en yakın kuşun yüksekliği
        input.push((yakinBird.loc.y-world.earthR)/world.atmosphere);

        // 6 en yakın kuşun bize göre yönü
        input.push( member.bird.right==yakinBird.right ? 1 : 0 );

        // 7 en yakın kuşun bize mesafesi
        input.push(Math.min(1000,min)/1000);

        // 8 en yakın kuşun boyutu
        input.push( yakinBird.size / SABITLER.MAXSIZE );

        min=999999;
        var yakinYem;

        world.foods.forEach(function(food){
            var d = (birdLA.d(food.loc.Angular2Analitic()));
            if(min>d){
                min = d;
                yakinYem = food;
            }

        });

        if(typeof yakinYem== 'undefined') return;

        // 9 en yakın yemin yükseliği
        input.push((yakinYem.loc.y-world.earthR)/world.atmosphere);

        // 10 en yakın yemin mesafesi
        input.push(Math.min(1000,min)/1000);

        member.ysa.fire(input);


        var outs = member.ysa.getOutputs()

        if( (outs[0] > 0.5) && member.bird.flyable()){
            // kanat çırp
            member.bird.fly();
        }

        if( (outs[1] > 0.5) && member.bird.nitroable()){
            // nitro
            member.bird.useNitro();
        }

    });
},75);



