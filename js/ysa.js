/**
 * Created by Can on 19.4.2016.
 */

var input = new ANN_Neuron();
var neuron = new ANN_Neuron();

var connection = input.connect(neuron);
connection.w = -0.5;


input.out = 5;

neuron.fire();

console.log(neuron.out);
console.log(input,neuron,connection);
