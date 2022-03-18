class ComplexCalculator extends RealCalculator {
    add(a, b) {
        return new Complex(a.re + b.re, a.im + b.im);
    }

    sub(a, b) {
        return new Complex(a.re - b.re, a.im - b.im);
    }

    mult(a, b) {
        return new Complex(
            a.re * b.re - a.im * b.im,
            a.re * b.im + a.im * b.re
        );
    }

    inv(a) {
        return new Complex(
            a.re / (a.re * a.re + a.im * a.im), -a.im / (a.re * a.re + a.im * a.im)
        );
    }

    div(a, b) {
        return new Complex(mult(a, inv(b)));
    }

    prod(a, p) {
        return new Complex(p * a.re, p * a.im);
    }

    zero() {
        return new Complex(super.zero())
    }

    one() {
        return new Complex(super.one());
    }

    pow(a, n) {
        let c = this.one();
        for (let i = 0; i < n; i++) {
            c = this.mult(a, c);
        }
        return c;
    }
}