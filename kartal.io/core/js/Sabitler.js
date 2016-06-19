/**
 * Created by Can on 10.4.2016.
 */
var SABITLER = {
    "VERSION" : "1.0.2",
    "EARTHR" : 5000,
    "ATMOSPHERE" : 1500,
    "GRAVITY" : -0.00042,
    "MAXSPEEDY" : 1,
    "STANDARTSPEED" : Math.PI/(7200*16),
    "NITRO_RATE" : 0.02,
    "FPS" : 60,
    "KUSORANI" : 1,
    "MAXSIZE" : 750,
    "DISTIME" : 1500,
    "FOODNUM" : 90,
    "IVMESELDUSUS" :    0.001
}

var BIRD_TYPES = [
    {
        body : new RGB(153,102,51),
        tail : [new RGB(255,102,0),new RGB(0,0,204),new RGB(255,51,51)]
    },
    {
        body : new RGB(0,0,0),
        tail : [new RGB(0,0,0),new RGB(0,0,0),new RGB(0,0,0)]
    },
    {
        body : new RGB(0,204,255),
        tail : [new RGB(0,255,255),new RGB(102,204,255),new RGB(102,255,255)]
    },
    {
        body : new RGB(204,51,0),
        tail : [new RGB(255,204,0),new RGB(255,204,0),new RGB(255,211,32)]
    },
    {
        body : new RGB(238,238,238),
        tail : [new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255)]
    },
    {
        body : new RGB(153,255,102),
        tail : [new RGB(0,102,0),new RGB(153,204,153),new RGB(87,157,28)]
    },
    {
        body : new RGB(255,51,51),
        tail : [new RGB(255,51,51),new RGB(255,51,0),new RGB(255,51,51)]
    },
    {
        body : new RGB(141,107,148),
        tail : [new RGB(177,133,167),new RGB(195,162,158),new RGB(177,133,167)]
    },
    {
        body : new RGB(109,33,60),
        tail : [new RGB(186,171,104),new RGB(148,104,70),new RGB(186,171,104)]
    },
    {
        body : new RGB(181,214,178),
        tail : [new RGB(90,70,76),new RGB(83,19,30),new RGB(90,70,76)]
    },
    {
        body : new RGB(255,78,0),
        tail : [new RGB(245,187,0),new RGB(142,166,4),new RGB(236,159,5)]
    },
    {
        body : new RGB(8,61,119),
        tail : [new RGB(244,211,94),new RGB(235,235,211),new RGB(238,150,75)]
    }
];