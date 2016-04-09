function YSA(){
	this.hiddenLayers = [];
	this.inputLayer = new YSA_Katman();
	this.outputLayer = new YSA_Katman();
	this.perceptronModu = false;
}
YSA.prototype = {
	perceptron : function(){
		//  snapsisleri perceptrona göre oluşturur
	}
}



function YSA_Katman(){
	this.sinirler = [];
	this.onceki;
	this.sonraki;
}

function YSA_Sinir(){
	this.fonksiyonlar = {
		toplama : YSA_f_toplam,
		transfer : [YSA_f_sigmoid]
	}
	this.output; // Sinir çıktısı saklanır

	// Sinirin bağlı olduğu şeyler
	this.yollar = {
		dentrit = [];
		akson = []
	}

}
YSA_Sinir.prototype = {
	bagla : function (sinir){
		sinir.dentrit.push(this);
		this.akson.push(sinir);
	},
	hesapla : function (){

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