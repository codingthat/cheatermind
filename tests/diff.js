"use strict"

var o = require("../node_modules/mithril/ospec")

var a = require("../src/js/AI")

a.init(4, 6)

o.spec("diff", function() {
    o("various examples work", function() {
        o(a.diff([0,1,2,3], [0,2,4,4])).deepEquals([1, 1, 2]);
        o(a.diff([0,1,2,3], [0,2,3,4])).deepEquals([1, 2, 1]);
        o(a.diff([0,1,2,3], [1,1,4,4])).deepEquals([1, 0, 3]);
        o(a.diff([0,1,2,3], [2,2,2,4])).deepEquals([1, 0, 3]);
        o(a.diff([0,1,2,3], [0,1,2,4])).deepEquals([3, 0, 1]);
        o(a.diff([0,1,2,3], [0,1,2,3])).deepEquals([4, 0, 0]);
        o(a.diff([0,1,2,3], [0,0,2,2])).deepEquals([2, 0, 2]);
    })
})