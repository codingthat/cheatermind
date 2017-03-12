// from https://gist.github.com/k-hamada/8aa85ac9b334fb89ac4f

function* zs1(n) {
    "use strict";

    if (n <= 0) throw new Error('positive integer only');
    yield [n];

    var x = new Array(n);
    x[0] = n;
    for (var i = 1; i < n; i++) x[i] = 1;

    var m = 0, h = 0, r, t;
    while (x[0] != 1) {
        if (x[h] == 2) {
            m += 1;
            x[h] = 1;
            h -= 1;
        } else {
            r = x[h] - 1;
            x[h] = r;

            t = m - h + 1;
            while (t >= r) {
                h += 1;
                x[h] = r;
                t -= r;
            }
            m = h + (t !== 0 ? 1 : 0);
            if (t > 1) {
                h += 1;
                x[h] = t;
            }
        }
        yield x.slice(0, m + 1);
    }
}

module.exports = { zs1 }