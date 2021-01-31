import { BeverageType, CoffeeMachine } from "./Infra";
import json_file from "../input.json";

const cf = new CoffeeMachine(json_file);

console.log(
  cf.get_beverages([
    BeverageType.hot_tea,
    BeverageType.hot_coffee,
    BeverageType.hot_coffee,
  ])
);

console.log(cf.low_ingredients());
