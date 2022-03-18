class Complex {
	constructor (re = 0, im = 0) {
		this.re = re;
		this.im = im;
		//console.log(this.re, this.im)
	}

	toString() {
        if(this.im) {
            if(this.im < 0) {
                return `${this.re}-i*${-this.im}`
            }
            return `${this.re}+i*${this.im}`

        }
        return this.re.toString();
    }
	
}