function CanvasRender(canvasId){ 
	/* var */
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext('2d');
	this.standartFont = "20px Arial";
	this.font(this.standartFont); // default font

	this.clickElement = [];

	this.updateInterval;


}


CanvasRender.prototype = {
	setUpdateFunc : function (f,t){
		this.updateInterval = setInterval(f,t);
	},
	removeUpdateFunc : function(){
		clearInterval(this.updateInterval);
	},

	clear : function(){
		this.context.clearRect(0, 0,this.canvas.width, this.canvas.height);
	},

	color : function ( color ){
		return this.context.fillStyle = color;
	},

	strokeStyle : function (strokeStyleI) {
		this.context.strokeStyle = strokeStyleI;
	},

	line : function (a,b,c,d) {
		this.context.beginPath();
		this.context.moveTo(a,b);
		this.context.lineTo(c,d);
		this.context.stroke();
	},

	circle : function (x,y,r,sAngle,eAngle) {
		if(typeof sAngle == 'undefined') sAngle = 0;
		if(typeof eAngle == 'undefined') eAngle = 2*Math.PI;
		this.context.beginPath();
		this.context.arc(x,y,r,sAngle,eAngle);
		this.context.stroke();
	},

	fill : function (){
		this.context.fill();
	},

	fillStyle : function(s){
		this.context.fillStyle = s;
	},

	font : function (f){
		this.context.font = f;
	},
	text : function (t,x,y,maxW){
		if(maxW)
			this.context.fillText(t,x,y,maxW);
		else
			this.context.fillText(t,x,y);
	},

	textStroke : function (t,x,y,maxW){
		this.context.strokeText(t,x,y,maxW);
	},

	rect : function (x,y,w,h) {
		this.context.fillRect(x,y,w,h);
	},
	
	loadImage : function (src) {
		var img = new Image();
		img.src = src;
		return img;
	},

	loadSVG : function (src,destination) {
		var ajax = new XMLHttpRequest();
		ajax.open("GET", src, true);
		ajax.send();
		ajax.onload = function(e) {
			var div = document.createElement("p");
			div.innerHTML = ajax.responseText;
			destination = div.getElementsByTagName("svg")[0];
			console.log(destination);
		}
	},

	img : function (img,x,y) {
		this.context.drawImage(img,x,y);
	},

	image : function(img,x,y,w,h){
		this.context.drawImage(img,x,y,w,h);
	},

	imageClipped : function(img,sx,sy,swidth,sheight,x,y,width,height){
		this.context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	},
	addClickListener : function(f,a){
		var t = this;
		if(typeof a != 'undefined')
			t.clickElement = a;
		this.canvas.addEventListener('mousedown', function(event) {
			var x = event.pageX - t.canvas.offsetLeft,
				y = event.pageY - t.canvas.offsetTop;

			var founded=false;
			t.clickElement.forEach(function(element) {
				if (y > element.top && y < element.top + element.height
					&& x > element.left && x < element.left + element.width) {
					element.func();
					founded = true;
				}
			});
			if(!founded)
				f(x,y);
		}, false);
	},

	translate : function(x,y){
		this.context.translate(x,y);

	},
	rotate : function(r){
		this.context.rotate(r);
	},
	scale : function(w,h){
		this.context.scale(w,h);
	},

	ellipse : function (cx, cy, w, h){
		this.context.beginPath();
		var lx = cx - w/2,
			rx = cx + w/2,
			ty = cy - h/2,
			by = cy + h/2;
		var magic = 0.551784;
		var xmagic = magic*w/2;
		var ymagic = h*magic/2;
			this.context.moveTo(cx,ty);
			this.context.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
			this.context.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
			this.context.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
			this.context.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
			this.context.stroke();
	},

}
