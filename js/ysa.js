/**
 * Created by Can on 19.4.2016.
 */

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

console.log(YSA.getOutputs());

