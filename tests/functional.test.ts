import { BeverageType, CoffeeMachine } from "../src/Infra";
import json_file from "../input.json";
var assert = require("assert");
describe("Functional Tests", function () {
  const machine = new CoffeeMachine(json_file);
  describe("Insufficient ingredients", function () {
    it("insufficient ingredients for three tea", function () {
      const requests = [
        BeverageType.hot_tea,
        BeverageType.hot_tea,
        BeverageType.hot_tea,
      ];

      const should_be_true = machine
        .get_beverages(requests)
        .some((r) => !r.success);

      assert.equal(should_be_true, true);
    });
    it("sufficient ingredients should provide tea", function () {
      machine.add_supply(machine.beverages.hot_tea);
      machine.add_supply(machine.beverages.hot_tea);

      const requests = [BeverageType.hot_tea, BeverageType.hot_tea];

      const should_be_false = machine
        .get_beverages(requests)
        .some((r) => !r.success);

      assert.equal(should_be_false, false);
    });
  });
  describe("Insufficient outlets/Wrong requests", function () {
    it("can not serve beverages more than the outlet count", function () {
      machine.outlets.count_n = 3;
      const requests = [
        BeverageType.hot_tea,
        BeverageType.hot_tea,
        BeverageType.hot_tea,
        BeverageType.hot_tea,
      ];

      const res = machine.get_beverages(requests)[0];

      assert.equal(res.label, "Can not serve");
    });
    it("can not serve 0 beverages", function () {
      const requests: Array<BeverageType> = [];

      const res = machine.get_beverages(requests)[0];

      assert.equal(res.label, "Can not serve");
    });
  });
  describe("Make Beverage", function () {
    it("Correct sequence of beverages should be served", function () {
      const requests = [
        BeverageType.black_tea,
        BeverageType.hot_coffee,
        BeverageType.hot_coffee,
      ];

      const should_be_false = machine
        .get_beverages(requests)
        .some((r, idx) => requests[idx] != r.label);

      assert.equal(should_be_false, false);
    });
  });
});
