function Vec2(x,y){ // 2 boyutlu vektör sınıfı
	/* var */
	this.x = x;
	this.y = y;
	/* func */ 
	this.add = function(v){ // bir vektörü üzerine ekler
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	this.inverse = function(){ // vektörün tersi
		return new Vec2(-this.x,-this.y);
	}
	this.d = function(v){ // vektörün diğer vektöre uzaklığı
		return this.inverse().add(v).l();
	}
	this.l = function(){ // vektörün uzunluğu
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
}
