/**
 * Test for class Card.
 */
"use strict";

/* global describe it */

var assert = require("assert");
const me = require("../../public/javascripts/index");

describe("Test something from our homepage", function() {
    describe("We test the info function.", function() {
        it("info.name should be Gunvor Nilsson", function() {
            var info = me.info.find();
            //console.log(info, info.name, typeof info, info[0]);
            let res = info[0].name;

            assert.equal(res, "Gunvor Nilsson");
        });

        it("info.city should be Mölndal", function() {
            let info = me.info.find();
            let res = info[0].city;

            assert.equal(res, "Mölndal");
        });
    });
});
