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

		this.inputLayer().fireConsecutive();
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

	return this;
};



function ANN_Layer(neuron_num){
	this.neurons = [];
	this.inputLayers=[]; // solundaki katman
	this.outputLayers=[]; // sağındaki katman
	while(neuron_num==0){
		this.neurons.push(new ANN_Neuron());
		neuron_num--;
	}
}

ANN_Layer.prototype = {
	connect : function(layer){

		var connection = new ANN_Connection;
		connection.input = this;
		connection.output = layer;

		// layerları bağlama
		layer.inputLayers.push(connection);
		this.outputLayers.push(connection);

	},
	connectWithNeurons : function(layer){
		this.connect(layer);
		// her nöronu teker teker bağla
		this.neurons.forEach(function(leftNeuron){
			layer.neurons.forEach(function (rightNeuron) {
				leftNeuron.connect(rightNeuron);
			});
		});
	},
	fire : function(){
		this.neurons.forEach(function(neuron){
			neuron.fire();
		});
	},
	fireConsecutive : function(){
		this.fire();
		if(this.right) this.right.fireConsecutive();
	},
	setOutputs : function (outputArray) {
		var neurons = this.neurons;
		outputArray.forEach(function(output,i){
			neurons[i].out = output;
		});
	},
	getOutputs : function () {
		var outputs = [];

		this.neurons.forEach(function(neuron){
			outputs.push(neuron.out);
		});

		return outputs;
	}
};

function ANN_Neuron(){
	this.functions = {
		sum : ANN_f_sum,
		transfer : [ANN_f_sigmoid]
	};
	this.out=0; // Sinir çıktısı saklanır

	// Sinirin bağlı olduğu şeyler

	this.dentrite = [];
	this.axon = []


}


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


function ANN_Connection (){ // KATMANLARI  veya NÖRONLARI bağlar.
	this.input;
	this.output;
	this.w=0; // sadece nöronlarda önemli
}



var ANN_f_sum = function (w,x){
	var r = 0;
	for(var i=0; i<w.length;i++)
		r += w[i]*x[i];
	return r;
};

var ANN_f_sign = function (o) { return Math.sign(o); }

var ANN_f_sigmoid  = function (t) { return 1/(1+Math.pow(Math.E, -t)); }


modele.exports = {
	Network : ANN,
	Layer : ANN_Layer,
	Neuron : ANN_Neuron,
	Connection : ANN_Connection
};