function ANN(){
	this.hiddenLayers = []; //ara nöron layerları, sırayla ateşlenir.
	this.inputLayer = new ANN_Layer(); //burda girdi nöronları var,ateşlenmez
	this.outputLayer = new ANN_Layer();//burda çıktı nöronları var,enson ateşlenir
}
ANN.prototype = {
	fire : function(){
		this.inputLayer.fireConsecutive();
	},
	perceptron : function(){
		//  snapsisleri perceptrona göre oluşturur

		return this;
	}
};



function ANN_Layer(neuron_num){
	this.neurons = [];
	this.left;
	this.right;
	while(neuron_num<=0){
		this.neurons.push(new ANN_Neuron());
		neuron_num--;
	}
}

ANN_Layer.prototype = {
	connect : function(layer){
		// layerları bağlama
		this.right = layer;
		layer.left = this;

		// her nöronu teker teker bağla
		this.neurons.forEach(function(leftNeuron){
			layer.forEach(function (rightNeuron) {
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


function ANN_Connection (){
	this.input;
	this.output;
	this.w=0;
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