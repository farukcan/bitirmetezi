/**
 * Created by Can on 16.5.2016.
 */

var exampleWeightGene = new Gene().TYPE(GA.TYPE.BIPOLAR);
var exampleEmptyChromosome = new Chromosome().VAL([]);

var chromosomeOfEve = new Chromosome().VAL({
    /* input sayısı : sabit */
    inputNN : new Gene().TYPE(GA.TYPE.INT).VAL(10).CHG(false),

    /* output sayısı : sabit */
    outputNN : new Gene().TYPE(GA.TYPE.INT).VAL(2).CHG(false),

    /* gizli katmanları sinir sayılarının dizisi */
    hiddenNN : new Chromosome().VAL([
        new Gene().TYPE(GA.TYPE.INT).MIN(5).MAX(15).VAL(10),
    ]).SIZE(4),

    /* ağın ağırlık matrislerinin dizisi */
    W : new Chromosome().VAL([ // ağırlık matislerinin dizisi
        new Chromosome().VAL([ // 3x2lik ağırlık matrisi
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL(),
                GA.copyGene(exampleWeightGene).VAL()
            ]),
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL(),
                GA.copyGene(exampleWeightGene).VAL()
            ]),
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL(),
                GA.copyGene(exampleWeightGene).VAL()
            ])
        ]),
        new Chromosome().VAL([ // 3x1lik ağırlık matrisi
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL()
            ]),
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL()
            ]),
            new Chromosome().VAL([
                GA.copyGene(exampleWeightGene).VAL()
            ])
        ])
    ])
}).RULE(function(val){
    /* Mutasyon ve Çaprazlama sonrası kromozomu onarma ve yönetmeyle sorunlu fonksiyondur.

     /* genin yapısı hakkında veri toplama */

    var inputNN = val.inputNN.val;
    var outputNN = val.outputNN.val;
    var hiddenNN = val.hiddenNN.toJSON();
    var wMatrixCount = hiddenNN.length+1;
    var layers = [];
    layers.push(inputNN);
    layers = layers.concat(hiddenNN);
    layers.push(outputNN);

    /* ### onarma işlemleri */

    /* # matris sayısını onarma */
    while(val.W.val.length < wMatrixCount){
        // mevcut ağırlık matrisi sayısı olması gerekenden düşükse
        GA.INS(val.W.val); // matris sayısını arttır
    }
    while(val.W.val.length > wMatrixCount){
        // mevcut ağırlık matrisi sayısı olması gerekenden düşükse
        GA.RMV(val.W.val); // matris sayısını azalt
    }

    /* # satır sayılarını onarma */
    val.W.val.forEach(function(matrisGene,matrisIndex){
        // her bir matris için
        var rowNum = layers[matrisIndex]+1;

        while(matrisGene.val.length < rowNum){
            GA.INS(matrisGene.val); // satır sayısını arttır
        }

        while(matrisGene.val.length > rowNum){
            GA.RMV(matrisGene.val); // satır sayısını azalt
        }
    });

    /* sutun sayılarını onarma */
    val.W.val.forEach(function(matrisGene,matrisIndex){
        // her bir matris için
        var columnNum = layers[matrisIndex+1];
        matrisGene.val.forEach(function(rowGene,rowIndex){
            // her satır için

            while(rowGene.val.length < columnNum){
                GA.INS(rowGene.val); // sutun sayısını arttır
            }

            while(rowGene.val.length > columnNum){
                GA.RMV(rowGene.val); // sutun sayısını azalt
            }
        });
    });

});