function YSA(){
	this.hiddenLayers = [];
	this.inputLayer = new YSA_Katman();
	this.outputLayer = new YSA_Katman();
	this.perceptronModu = false;
	this.perceptron = function(){
		//  snapsisleri perceptrona göre oluşturur
	}
}

function YSA_Katman(){
	this.sinirler = [];
}

function YSA_Sinir(){
	this.fonksiyonlar = {
		toplama : YSA_f_toplam,
		transfer : [YSA_f_sigmoid]
	}
	this.akson; // Sinir çıktısı saklanır

	// Sinirin bağlı olduğu şeyler
	this.yollar = {
		gelen = []
		giden = []
	}
	this.bagla = function (sinir){
		sinir.gelen.push(this);
		this.giden.push(sinir);
	}
	this.hesapla = function (){

	}
}

var YSA_f_toplam = function (w,x){
	var r = 0;
	for(var i=0; i<w.length;i++)
		r += w[i]*x[i];
	return r;
}

var YSA_f_sign = function (o) { return Math.sign(o); }

var YSA_f_sigmoid  = function (o) { return o; }