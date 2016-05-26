# Nöroevrim
## Tanım
Yapay sinir ağlarının genetik algoritmalar ile evrimleştirme tekniğidir.
 Bu teknikte, Yapay sinir ağları ve Genetik algoritmalar birlikte kullanılır.
Bu tekniğin zorluğu, Yapay sinir ağlarının bağlantılarının, ağırlıklarının, nöron sayılarının ve katman sayılarının evrimsel bir süreçle belirlenmesidir.
Yapay sinir ağları öğrenmede sadece ağırlıklarını değiştirirken, bu teknikte sinir ağı tamamen otomatik oluşturulur. Eğer oluşturulan sinir ağı yapısı itibariyle yetersiz ise, sonraki nesillerde sinir ağının yapısıda değişebilir.
Yapay sinir ağının yapısı tamamen kromozom üzerinde saklanacağı için, sinir ağı tamamen mutasyonlara ve çaprazlamalara uğramaya açıktır.

## Yapay Sinir Ağının Genetik Olarak Modellemesi
Yapay sinir ağları , girişlerden ve çıkışlardan oluşur. Giriş ve çıkış sayısı değişemeyeceği için, bu değerlerinin genetik transformasyonlara tabi tutulmasına gerek yoktur.
Bir Perceptron ağı gizli katmanlardan oluşur ve bu gizli katmanların sayısı değişebilir. Gizli katmanların sinir sayılarıda değişebilir. O zaman gizli katmanlar diye bir genetik diziye ihtiyacımız vardır. Bu dizisinin içine her katmanın sinir sayısı belirleyen genler koyulmalıdır.
Yapay sinir ağlarının en önemli parçası ağırlıklardır. Her katman arası ağırlıkları tutan ağırlıklık matrisleri iç içe genetik dizi olarak saklanabilir. Bu ağırlık matrislerininde dizi olacağı için, iç içe 3 dizi katmanına sahip bir yapı oluşturmalıyız. Bu yapıda sürekli, katmanlara ve sinir sayılarına göre güncellenmelidir.

### YSA'nın genetik ifadesi
* Giriş katmanı sinir sayısı
* Çıkış katmanı sinir sayısı
* Gizli katman sinir sayısı dizisi
	* Gizli katman 1'in sinir sayısı
	* Gizli katman 2'nin sinir sayısı
	* ...
	* Gizli katman n'in sinir sayısı
* Ağırlık matrisleri dizisi
	* Ağırlık matrisi 1
		* Satır 1 :  [ ... ]
		* ...
		* Satır n : [ ... ]
	* ...
	* Ağırlık matrisi n
		* Satır 1 :  [ ... ]
		* ...
		* Satır n : [ ... ]

### evulotion.js ile ifadesi
```
var chromosomeOfEve = new Chromosome().VAL({
    /* input sayısı : sabit */
    inputNN : new Gene().TYPE(GA.TYPE.INT).VAL(10).CHG(false),

    /* output sayısı : sabit */
    outputNN : new Gene().TYPE(GA.TYPE.INT).VAL(2).CHG(false),

    /* gizli katmanları sinir sayılarının dizisi */
    hiddenNN : new Chromosome().VAL([
        new Gene().TYPE(GA.TYPE.INT).MIN(5).MAX(15).VAL(11),
        new Gene().TYPE(GA.TYPE.INT).MIN(5).MAX(15).VAL(10)
    ]).SIZE(3),

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
})
```