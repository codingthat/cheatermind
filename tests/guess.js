"use strict"

var o = require("../node_modules/mithril/ospec")

var a = require("../src/js/AI")

o.spec("guess", function() { // WARNING: guess mutates AI.possibleCodes (for efficiency) so an .init() call is needed to reset it
    o("example 1", function() {
        a.init(4, 6);
        o(a.guess([0,0,0,0])).deepEquals([0, 0, 4]);
        o(a.guess([1,1,1,1])).deepEquals([1, 0, 3]);
        o(a.guess([2,3,4,5])).deepEquals([0, 2, 2]);
        o(a.guess([1,3,4,5])).deepEquals([0, 3, 1]);
        o(a.guess([1,1,4,5])).deepEquals([0, 2, 2]);
        o(a.guess([2,3,1,1])).deepEquals([1, 1, 2]);
        o(a.guess([0,0,1,1])).deepEquals([1, 0, 3]);
        o(a.guess([0,0,0,1])).deepEquals([1, 0, 3]);
        o(a.guess([3,3,3,1])).deepEquals([2, 0, 2]);
        o(a.guess([0,0,3,1])).deepEquals([2, 0, 2]);
        o(a.guess([4,4,3,1])).deepEquals([2, 0, 2]);
        o(a.guess([5,5,3,1])).deepEquals([4, 0, 0]);
    })
    o("example 2", function() {
        a.init(7,7);
        o(a.guess([0,1,2,3,4,5,6])).deepEquals([1, 4, 2]);
        o(a.guess([4,3,2,1,0,0,0])).deepEquals([1, 3, 3]);
        o(a.guess([5,1,3,2,1,1,0])).deepEquals([1, 3, 3]);
        o(a.guess([6,5,0,3,2,2,0])).deepEquals([0, 3, 4]);
        o(a.guess([3,1,6,4,3,0,1])).deepEquals([1, 4, 2]);
        o(a.guess([2,3,4,6,4,1,1])).deepEquals([2, 4, 1]);
        o(a.guess([4,0,1,2,4,6,1])).deepEquals([0, 7, 0]);
        o(a.guess([1,1,4,6,0,4,2])).deepEquals([3, 4, 0]);
        o(a.guess([1,2,4,4,0,1,6])).deepEquals([7, 0, 0]);
    })
    o("tiny test", function() {
        a.init(1, 1);
        o(a.guess([0])).deepEquals([1, 0, 0]);
    })
    o("tiny test 2", function() {
        a.init(1, 2);
        o(a.guess([0])).deepEquals([0, 0, 1]);
        o(a.guess([1])).deepEquals([1, 0, 0]);
    })
    o("tiny test 3", function() {
        a.init(2, 2);
        o(a.guess([0,1])).deepEquals([1, 0, 1]);
        o(a.guess([1,1])).deepEquals([0, 0, 2]);
        o(a.guess([0,0])).deepEquals([2, 0, 0]);
    })
})