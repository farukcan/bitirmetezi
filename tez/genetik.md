# Genetik Algoritma
[TOC]
Kısaltmalar : GA (Genetik Algoritma)

## Tanımlar
Genetik algoritmalar doğadaki evrimsel süreci taklit eden optimizasyon yöntemleridir. 

Her problemde en iyi çözümü bulması zorunlu değildir. Fakat amacı en iyi veya en iyiye yakın çözümü bulmaktır. En iyilerin hayatta kalması şartına göre çalışır ve bu "hayatta kalmak" amacı, "en iyi çözüme uygun olmak" amacıyla değiştirelerek birçok probleme uygulanabilir. Bu kavrama "Fitness" veya "Uygunluk" diyebiliriz.

Yine doğada nasıl tek canlı yani tek çözüm yoksa, genetik algoritmalarda da tek çözüm yoktur. Tüm çözümlerin ortak kümesine Popülasyon denilir. Kötü çözümlerin yok olma zorunluluğu yoktur. Kötü çözümlerin ne kadar yok olma ihtimali yüksek olsada, bir çok genetik yöntemde,kötü çözümler bizi ilerde iyi bir sonuca götürebileceği için tamamen yok edilmezler.

Genetik algoritmalarda her bir çözüm Kromozomlarda tutulur ve her bir çözüm değişkenine Gen denir. Onun için "çözüm" kelimesi yerine Birey kelimesini kullanacağız.Her kromozom sahibi olan ve Popülasyonun üyesi olan şeye 'Birey(Member)' denilir. Her birey üreyip, çocuklar oluşturabilir. Bu durumda o birey, çocukların ebeveyni olur. Dolayısıyla ilk ebeveynler için bir başlangıç populasyonu olması gerekir. Genelde başlangıç populasyonu rastgele oluşturulur.

Genetik algoritmalar 3 kavram üzerine kuruludur ;  Mutasyon, Çaprazlama ve Seçilim.

Bir bireyin genleri çocuklarına aktarılırken, mutasyonlar oluşabilir. Mutasyonlar, gen aktarımda oluşan hatalardır. Bilgisayarda, bu hatayı doğadaki gibi taklit etmek için rastgelelik fonksiyonları kullanılır.
Mutasyon, doğadaki gibi çoğu sefer zararlı olabilir. Mutasyon sonucu olşan zararlı özellik o canlının hayatta kalma ihtimalini (uygunluğunu) düşürecektir. Fakat bazı zamanlar, mutasyonlar canlıya  faydalı olabilir. Bu faydalı özellikler canlının hayatta kalma ihtimali arttıracak ve diğerlerine karşı o canlıyı üstün kılacaktır. Onun için mutasyondan kötü etkilenen canlı zamanla yok olur, iyi etkilenen ise büyük avantajlar sağlayarak, kendini çoğaltır.

Çaprazlama, 2 canlının eşeyli üreyerek kendi kromozomlarını tek bir kromozoma naklederek, kendilerinde farklı bir çocuk oluşturmasıdır. Çocuk, ebeveynlerinin özelliklerini taşır. Ebeveynlerini kısmen benzer. Bunun sebebi, iki ebeveynin kromozomlarının bir veya birkaç noktadan kesilerek, iki taraftan rastgele alınan genler ile bir kromozom oluşturulmasıdır.

Doğal seçilim, hayatta kalma ihtimali az olan canlıların birçoğunun ölüp, hayatta kalma ihtimali yüksek olanlarının bir çoğunun hayatta kalmasıdır. Eğer doğada bir elitizim(en iyinin ölmemesi) durumu yoksa, hayatta kalma ihtimali yüksek olanınında yine ölme ihtimali vardır.
Bilgisayarda seçilim, bireyin uygunluk fonksiyonu gözetilerek rastgele yapılır. Doğanın zor koşulları ve ön görülemezliği, rastgelelik fonksiyonları ile taklit edilir.

Bu algoritmalar ilk kez  1975 yılında John Holland'ın “Adaptation in Natural and Artificial Systems” kitabında ortaya atılmıştır

### Evolotion (Evrim)
Altında populasyonları bulunduran. En üst sınıftır.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	populations[]	|	Populasyonlar			|
|	parameters{}	|	Evrimsel parametreler	|

|	parameters{}	|	açıklama				|
|	--------	|	--------				|
|	crossing_over_rate	|	çaprazlama ihtimali		|
|	mutation_rate	|	mutasyon ihtimali		|
|	population_size	|	populasyon büyüklüğü (önerilen 100-300)	|
|	real_timed	|	populasyon büyüklüğü (önerilen 100-300)	|


|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	fitness()	|	fitness fonksiyonu	|
|	createPopulation(population_size)	|	Rastgele başlangıç populasyonu oluşturur	|

### Population (Populasyon)
Member'ların dizisidir. Population'un fitness fonksiyonu ve Memberların en iyi ve kötüsü burada belirlenip, sıralanır.

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	members[]	|	Population'un üyelerinin	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	select()	|	Seçilim Yapar	|

### Member (Birey)
Population'un her bir üyesine verilen addır
Chromosome'a sahiptir

|	değişken	|	açıklama				|
|	--------	|	--------				|
|	int generation	|	Memberin kaçıncı nesil olduğunu saklar	|
|	num fitness	|	Memberin fitness değeri	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	kill()	|	Üye öldürülür	|
|	generate()	|	Üye ürer		|

### Fitness (Uygunluk)
Bir Memberin amacına ne kadar uygun olduğunu belirleyen fonksiyondur. Mesele : Hayatta kalmak ve Üreyebilmek
Yüksek olması Memberin, soyunun devam edebilme ihtimalini arttırır.

### Chromosome (Kromozom)
Gene'lerden oluşan bir dizidir.

|	değişken	|	açıklama			|
|	--------	|	--------			|
|	genes[]	|	Chromosome'un Gene'leri	|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	mutate()	|     her Gene mutasyona uğrar   |
|	crossingOverWith(chromosome)	|	Başka bir Chromesome ile crossing over yapar	|

### Gene (Gen)
Member'in yapısı belirleyen her bir birime denir.

|	Gen Türü	|	açıklama			|
|	--------	|	--------			|
|	binary		|	0 -> 1	[0 veya 1]									|
|	unipolar	|	0 -> 1		0.3->0.5 [0 ile 1 arası değer]			|
|	bipolar		|	-1 -> 1		-0.3->0.5 [-1 ile 1 arası değer]		|
|	permutation	|	[A,B,C] -> [B,C,A]	[SADECE YER DEĞİŞTEREN DİZİ]	|
|	string		|	"abc"	->	"adef"									|
|	const_string|	"abc"	->	"def"									|
|	chromesome	|	başka genlerden oluşan, gen dizisi					|
|	const_chromesome	|	başka genlerden oluşan, sabit gen dizisi					|

|	fonksiyon	|	amaç		|
|	--------	|	--------	|
|	mutate()	|	mutasyona uğrar	|

### Başlangıç Populasyonu

Populasyon büyüklüğüne bağlı olarak ilk oluşan rastgele populasyondur.

### Fitness Fonksiyonu (Uygunluk Fonksiyonu)
Bireyin ne kadar uygun olduğunu belirleyen değeri üreten fonksiyondur. Uygun populasyon üyesi daha fazla soyunu devam ettirmeye meyillidir. Bu fonksiyonun döndürdüğü değerin yüksek olması canlının, soyunu devam ettirme ihtimalini arttırır.

### Çaprazlama
Tek noktalı takas: Genlerden bir nokta seçilir. O Noktadan bölünürek parçalar değiştirilir.

Çok noktalı takas: Gen çok noktadan parçalanarak, parçalar yer değiştirir.

Tek basamaklı takas (uniform) : Her gen,belli bir olasılıkta diğer genle yer değiştirir.

Aritmatik takas : AND,OR,XOR ile yapılan takastır. X AND Y = 0 AND 1 = 0

### Mutasyon
Her gen, alabileceği bir değer ile değiştirilir veya o miktarda arttırılıp,azaltılır.

### Seçilim
Rulet seçimi : Tüm bireylerin uygunluk değerleri bir tabloya yazılır, sonra bu uygunluk değeri toplam uygunluk değerine bölünerek, olasılıklar belirlenir.

Sıralama seçilimi : Rulet seçiminde, eğer çok yüksek uygunluğa sahip birey varsa , diğerlerinin seçilim ihtimali imkansızlaşmaktadır. Buda ileri vadede bir sorundur. Onun için uygunluk değerine göre değilde, sıralama yapılarak kaçıncı sırada olduğuna göre bir seçilim yapılır. Yani uygunluk değeri 1 ile (Birey Sayısı) arasında olur.

Sabit durum seçimi : Buna göre, ebeveyn seçimi için kromozomların büyük parçaları bir sonraki nesile taşınmalıdır. Yeni döl oluşturulma üzere birkaç kromozom seçilir.(Genellikle en yüksek uygunluğa sahip olanlar seçilir.)

Seçkinlik(Elitizm) : En iyi(ler) birey bozulmadan bir sonraki jenerasyona kopyalanır.

### Gerçek Zamanlılık
Eğer evrimsel süreç gerçek zamanlıysa, bireyin ölmesi ve üremesi durumları göz önüne alınır.
Evrimsel algoritma, adım adım olarak değil, asenkron şekilde çalışır. Yani 1.nesil birey ile 3.nesil birey aynı populasyonda bulunabilir.

## Algoritma

1. Rastgele başlangıç populasyonu üret
2. Populasyonu değerlendir
3. Maximum nesile ulaşıldıysa ; Adım 8'e git
4. Seçilim yap
5. Çaprazlama yap
6. Mutasyona uğrat
7. Adım 2'ye git
8. Dur
