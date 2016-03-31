/* # bağlılıklar
	- lib/global
	- lib/Vec2
	- lib/CanvasRender
*/

/* GLOBAL VAR */

	var anaLoop; // gerçek zamanlılık sağlayan döngüdür

	var HIZ = 0; // anaLoopün tekrar periyodudur

	var iterasyon = 0; // anaLoop kaç defa tekrar etti

	var habitat; // Tüm Canlıların ve Yiyeceklerin kontrolüdür

	var render; // dünyayı çizer ve bizim görmemizi sağlar.

/* GLOBAL FUNC */




/* GLOBAL KOD */

	yarat(); // herşeyi başlatan fonksiyon

/* GLOBAL KOD SONU */




function yarat(){

	render = new CanvasRender("world"); // render bir canvas renderer ile yapılır #world

	habitat = new Habitat();

	anaLoop = setInterval(update,HIZ); // gerçek zaman döngüsünü başlatır

}

function update(){

		iterasyon++;

		habitat.update(); // popülasyonu günceller/canlılık verir

		render.update(); // Popülasyonun dünyasını görmemiz için görüntü oluşturur
}

/* CLASS */

function Habitat(){
	this.populasyon = new Populasyon();
	this.yiyecekler = new Yiyecekler();

	this.update = function () {
		this.populasyon.update();
	}
}

function Populasyon(){
	/*
		Bütün canlılar bu sınıfla kontrol edilir
	*/

	/* var */
	this.mahluklar = [];


	/* func */
	this.update = function () {
		
	}
}

function Mahluk(){
	/*
		Herhangi bir canlıya ait sınıftır
	*/

	/* var */
	this.gen;
}

function Gen(){
	/*
		Canlıya ait bir gen dizilimidir.
	*/

}

function Yemek(){
	/*
		Doğadaki her yangi bir yiyecektir.
	*/

	/* var */
	this.konum = new Vec2(x,y);
	this.r;
}

function Yiyecekler(YEMEK_MIKTARI){
	/* var */
	this.yemekler = [];
    for ( var i = 0; i < YEMEK_MIKTARI; i++ ) {
        this.yemekler.push( new Yemek() );
    }

}


