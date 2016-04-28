# Genetik Algoritma
[TOC]

## Tanımlar

### Population
Member'ların dizisidir. Population'un fitness fonksiyonu ve Memberların en iyi ve kötüsü burada belirlenip, sıralanır.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	members[]	|	Population'un üyelerinin	|

### Member
Population'un her bir üyesine verilen addır. 
Chromosome'a sahiptir

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	kill()	|	Üye öldürülür	|
|	generate()	|	Üye ürer		|

### Fitness
Bir Memberin amacına ne kadar uygun olduğunu belirleyen fonksiyondur. Mesele : Hayatta kalmak ve Üreyebilmek
Yüksek olması Memberin, soyunun devam edebilme ihtimalini arttırır.

### Chromosome
Gene'lerden oluşan bir dizidir.
mutate() crossingOverWith(member)


|	değişken	|	açıklama			|
|	--------	|	--------			|
|	genes[]	|	Chromosome'un Gene'leri	|


|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	mutate()	|     her Gene mutasyona uğrar   |
|	crossingOverWith(chromosome)	|	Başka bir Chromesome ile crossing over yapar	|




### Gene
Member'in yapısı belirleyen her bir birime denir.

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	mutate()	|	mutasyona uğrar	|

