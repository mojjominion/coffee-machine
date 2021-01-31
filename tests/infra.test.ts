import { BeverageType, CoffeeMachine } from "../src/Infra";
import json_file from "../input.json";
var assert = require("assert");
describe("Infrastructure Tests", function () {
  const machine = new CoffeeMachine(json_file);
  describe("Adding/Subtracting supply", function () {
    it("Adding/Subtracting 0 should not change the qty", function () {
      const preValue = machine.inventory.ginger_syrup;
      machine.add_supply({ ginger_syrup: 0 });
      machine.remove_supply({ ginger_syrup: 0 });

      assert.equal(machine.inventory.ginger_syrup, preValue);
    });

    it("Adding positive value should increase the qty", function () {
      const preValue = machine.inventory.ginger_syrup;
      machine.add_supply({ ginger_syrup: 4 });

      assert.equal(machine.inventory.ginger_syrup > preValue, true);
    });
    it("Using ingredients should decrease the qty", function () {
      const preValue = machine.inventory.ginger_syrup;
      machine.remove_supply({ ginger_syrup: 4 });

      assert.equal(machine.inventory.ginger_syrup < preValue, true);
    });
  });
  describe("Subtracting ingredients more that the present qty", function () {
    it("Value should be unchanged", function () {
      const preValue = machine.inventory.ginger_syrup;
      machine.remove_supply({ ginger_syrup: preValue + 1 });
      assert.equal(machine.inventory.ginger_syrup, preValue);
    });
  });

  describe("Adding & subtracting same value of ingredients", function () {
    it("Value should be unchanged", function () {
      const preValue = machine.inventory.ginger_syrup;

      machine.add_supply({ ginger_syrup: 45 });
      machine.remove_supply({ ginger_syrup: 45 });

      assert.equal(machine.inventory.ginger_syrup, preValue);
    });
  });
});
