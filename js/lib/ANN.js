//	#
//	#	*** ANN.js ***
//	#

//	#	by Faruk CAN ( farukcan.net ) @ 2016
//	#	license : GNU GPL


// @class ANN
function ANN(){
	this.layers = []; //YSAnın katmaları bu dizide tutulur
	this.TYPE="CUSTOM"; // YSA'nın tipi
}

// @prototype ANN : fonksiyonlar...
ANN.prototype = {
	inputLayer : function(){ // bu fonk. ilk katmanı döndürür.
		return this.layers[0];
	},
	outputLayer : function(){  // buda son " " "
		return this.layers[this.layers.length-1];
	},
	fire : function(inputArray){ // tüm YSAyı ateşler
		if(inputArray)
			this.setOutputs(inputArray);

		this.layers[1].fireConsecutive();
	},
	getOutputs : function(){ // son katmının çıkış değetlerini döndürür.
		return this.outputLayer().getOutputs();
	},
	setOutputs : function(outputs){ // ilk katmanın outputlarını günceller.
		this.inputLayer().setOutputs(outputs);
	}
};

// @arcitures ANN Burada belirli YSA modelleri oluşturma fonksiyonları tutulur.

// @arc PERCEPTRON ### kullanım ysa = new ANN().PERCEPTRON(5,[4,3,3],2);
ANN.prototype.PERCEPTRON = function(inputNeuronNum,arrayof_hiddenLayersNeuronNum,outputNeuronNum){
	this.TYPE = "PERCEPTRON";


	// |# OLUŞTURUCU

		// ilk katman : inputLayer
		var addLayer = function(L,n){
			L.push(new ANN_Layer(n));
			return L[L.length-1];
		};

		var layerBefore = addLayer(this.layers,inputNeuronNum);

		// gizli katmanlar
		var _this = this;
		arrayof_hiddenLayersNeuronNum.forEach(function(hiddenNum){
			var hidden = addLayer(_this.layers,hiddenNum);
			layerBefore.connectWithNeurons(hidden);
			layerBefore = hidden;
		});

		// outputLayeri yarat ve bağla
		var outputLayer = addLayer(this.layers,outputNeuronNum);
		layerBefore.connectWithNeurons(outputLayer);

	// |# OLUŞTURUCU SONU

	// |# FONKSİYONLAR

		this.setWeights = function(wArray){ // Bu fonksiyon Perceptron ağının ağırlıklarını günceller.
			var _this = this;
			wArray.forEach(function(w,i){
				_this.layers[i].neurons.forEach(function(neuron,m){
					neuron.axon.forEach(function(axon,n){
						axon.w = w[m][n];
					});
				});
			});
			return this;
		};

		this.biases = [];
		this.setBias = function(biasArray){
			if(this.biases.length==0){
				for(var i=0;i<biasArray.length;i++){
					var bias = new ANN_Bias(biasArray[i]);
					this.layers[i+1].neurons.forEach(function(neuron){
						bias.connect(neuron);
					});
					this.biases[i] = bias;
					this.layers[i].neurons.push(bias);
				}
			}else{
				for(var i=0;i<biasArray.length;i++){
					this.biases[i].out = biasArray[i];
				}
			}
			return this;
		};


	// |# FONKSIYONLAR SONU


	return this;
};


// @class ANN_Layer
function ANN_Layer(neuron_num){
	this.neurons = []; // katmanın nöronları
	this.dentriteLayers=[]; // solundaki katmanlar
	this.axonLayers=[]; // sağındaki katmanlar

	// nöron sayısı belirtildiyse nöronları oluştur.
	if(typeof neuron_num=='number'){
		while(neuron_num>0){
			this.neurons.push(new ANN_Neuron());
			neuron_num--;
		}
	}
}

// @prototype ANN_Layer
ANN_Layer.prototype = {
	connect : function(layer){ // iki katmanı birbirine bağlar

		var connection = new ANN_Connection;
		connection.input = this;
		connection.output = layer;

		// layerları bağlama
		layer.dentriteLayers.push(connection);
		this.axonLayers.push(connection);

	},
	connectWithNeurons : function(layer){ // iki katmanı birbirine nöronlarıyla birlikte bağlar.
		this.connect(layer);
		// her nöronu teker teker bağla
		this.neurons.forEach(function(leftNeuron){
			layer.neurons.forEach(function (rightNeuron) {
				leftNeuron.connect(rightNeuron);
			});
		});
	},
	fire : function(){ // katmandaki bütün nöronları ateşler
		this.neurons.forEach(function(neuron){
			neuron.fire();
		});
	},
	fireConsecutive : function(){ // bu katmanı ve bu katmanın sağındaki bütün katmanları ateşler
		this.fire();
		if(this.axonLayers.length!=0){
			this.axonLayers.forEach(function(connection){
				connection.output.fireConsecutive();
			});
		}
	},
	setOutputs : function (outputArray) { // katmandaki nöronları çıktılarını günceller
		var neurons = this.neurons;
		outputArray.forEach(function(output,i){
			neurons[i].out = output;
		});
	},
	getOutputs : function () { // katmandaki nöronların çıktılarını alır
		var outputs = [];
		this.neurons.forEach(function(neuron){
			outputs.push(neuron.out);
		});
		return outputs;
	}
};

// @class ANN_Neuron
function ANN_Neuron(){
	this.functions = {
		sum : ANN_f_sum,
		transfer : [ANN_f_sigmoid]
	};
	this.out=0; // Sinir çıktısı saklanır

	// Sinirin bağlı olduğu şeyler

	this.dentrite = []; // nörona gelen bağlantılar
	this.axon = []; // nörondan giden bağlantılar

}

// @prototype ANN_Neuron
ANN_Neuron.prototype = {
	connect : function (neuron){
		var connection = new ANN_Connection;
		connection.input = this;
		connection.output = neuron;

		neuron.dentrite.push(connection);
		this.axon.push(connection);

		return connection;
	},
	fire : function (){
		var x = [],w = [];
		this.dentrite.forEach(function(c){
			x.push(c.input.out);
			w.push(c.w);
		});
		var o = this.functions.sum(w,x);
		this.functions.transfer.forEach(function(f){
			o = f(o);
		});
		return this.out = o;
	}
};

// @class ANN_Bias
function ANN_Bias(out) {
	this.out = out;
	this.axon = [];
}
// @prototype ANN_Bias
ANN_Bias.prototype.connect = ANN_Neuron.prototype.connect;
ANN_Bias.prototype.fire = function(){};

// @class ANN_Connection
function ANN_Connection (w){ // KATMANLARI  veya NÖRONLARI bağlar.
	this.input;
	this.output;
	this.w=ANN_default_w; // sadece nöronlarda gerekli
	if(typeof w == 'number') this.w = w;
}

//	#
//	# (+) Toplama Fonksiyonları
//	#


var ANN_f_sum = function (w,x){// ağırlığa göre topla
	var r = 0;
	for(var i=0; i<w.length;i++)
		r += w[i]*x[i];
	return r;
};

//	#
//	# (f) Transfer Fonksiyonları
//	#
var ANN_f_sign = function (o) { return Math.sign(o); }; // 0'dan konuma göre -1 veya 1

var ANN_f_sigmoid  = function (t) { return 1/(1+Math.pow(Math.E, -t)); }; // sigmoid fonksiyonu

var ANN_default_w = 0;


/*
// require için belki ilerde lazım olur diye...
module.exports = {
	Network : ANN,
	Layer : ANN_Layer,
	Neuron : ANN_Neuron,
	Connection : ANN_Connection
};
*/