# Yapay Sinir Ağları

[TOC]

İnsan beyninin özellikleri taklit edilerek geliştirilmiş bir bilgi işleme tekniğidir. Sinir ağı, sinirlerden ve sinirler arası bağlantılardan oluşur.

**NOT**:*Buradaki bilgilerden yararlanılarak ANN.js kütüphanesi yazıldı.*

## Network (Sinir Ağı)

Katmanlardan ve sinirlerden oluşan yapıdır.

**Network (ANN) Sınıfı**

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	layers[ ]	|	Ağın katmanlarının dizisidir.	|
|	TYPE	|	Ağın mimari tipidir	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	fire( [inputArray] )	|	Ağı girdilerden(inputArray içindeki veya girdi katmanınındaki çıkış değerlerinden) çıktı üretmek için ateşler	|
|	inputLayer()	|	Girdi katmanını döndürür	|
|	outputLayer()	|	Çıktı katmanını döndürür	|
|	getOutputs()	|	Son katmının çıkış değetlerini döndürür.	|
|	setOutputs( outputs )	|	Girdi katmanının outputlarını günceller.	|

### Ağ mimarileri


#### Perceptron

Sıralı katmanlardan oluşan, girdi ,gizli ve çıktı katmanı sahibi çok katmanlı sinir ağı mimarisidir.

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	setWeights(wArray)	|	w : Katmanların ağırlık matrisilerinin dizisidir. Bu fonksiyon ağırlıkları günceller.	|

##### Perceptronun Javascriptte Oluşturulması ve Ateşlenmesi
```
// @Gerekli : ANN.js

// # Giriş katmanı 3, Gizli katmanı 2, Çıkış katmanı 1 sinirden oluşan perceptron ağı oluştur ;
var YSA = new ANN().PERCEPTRON(3,[2],1);


// # 2 adet ağırlık matrisi ile ağı set et ;
YSA.setWeights([
    [
        [1,1],
        [-1,-1],
        [0.5,0.5]
    ],
    [
        [1],
        [1]
    ]
]);

// # [0.5,0.5,0.5] girdi vektörü ile ileri beslemeli olarak ateşle.
YSA.fire( [0.5,0.5,0.5] );

console.log(YSA.getOutputs()); 
// # çıktı : [ 0.7547952605810734 ]


```
**Bias ile**
```
var YSA = new ANN().PERCEPTRON(2,[2],1).setBias( [-1,-1] );

YSA.setWeights([
    [
        [1,1],
        [0.5,0.5],
        [-1,-1]

    ],
    [
        [1],
        [1],
        [-1]
    ]
]);

YSA.fire([0.5,0.5]);

console.log(YSA.getOutputs()); // # çıktı : [ 0.9372567117128635 ]
```

## Layer (Katman)

Sinir hücrelerinden oluşan gruplardır.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	neurons[ ]	|	Katmana bağlı sinirlerin dizisidir.	|
|	dentriteLayers[ ]	|	Bu katmanın solundaki katmanların bağlantıların dizisidir.Bunlar kendisinden önce ateşlenecek katmanlardır.	|
|	axonLayers[ ]	|	Bu katmanın sağındaki katmanların bağlantıların dizisidir. Bunlar kendisinden sonra ateşlenecek katmandır	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	connect( layer )	|	Bu katmanı diğer katmana bağlar.	|
|	connectWithNeurons( layer )	|	Bu katmanı diğer katmana bağlar. İki katmanın sinirlarini birbirine bağlar.	|
|	fire()	|	Katmandaki bütün sinirleri ateşler.	|
|	fireConsecutive()	|	Bu katmanı ve buna bağlı bütün katmanlı ardarda ateşler.	|
|	getOutputs()	|	Katmanın sinirlerin çıkış değerleri dizi olarak döndürür.	|
|	setOutputs( outputArray )	|	Katmanın sinirlerin çıkış değerleri günceller.	|


## Neuron (Sinir)

Başka sinirlerden dentriteler ile bilgi alıp, toplama ve transfer fonksiyonu tâbi tutup, bu çıktıyı başka sinirlere axonlar ile veren yapının, her hücresine sinir denir.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	functions.sum ()	|	Toplama fonksiyonudur. (Varsayılan : sum(+) )	|
|	functions.transfer[ ] ()	|	Transfer fonksiyonlarının dizisidir. (Varsayılan : [ sigmoid(f) ] )	|
|	out	|	Sinirin çıktısıdır.	|
|	dentrite [ ]	|	Sinire gelen bağlantıların dizisidir.	|
|	axon [ ]	|	Sinirden çıkan bağlantıların dizisidir.	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	connect( neuron )	|	Bu sinire başka sinire bağlar. Axon oluşturur.	|
|	fire ()	|	Siniri ateşler.	|


## Connection(Bağlantı)

Sinirleri veya Katmanları birbirine bağlayan yapıdır.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	input	|	Bağlantının başladığı yer.(Sinir veya Katman)	|
|	output	|	Bağlantının bittiği yer.(Sinir veya Katman)	|
|	w	|	Bağlantının ağırlığıdır. (Sadece sinirlerde kullanılır)	|