import { add, isGreaterThan, sub } from "./utils";
interface Response {
  label: string;
  message: string;
  success?: boolean;
}
export enum BeverageType {
  hot_tea = "hot_tea",
  hot_coffee = "hot_coffee",
  black_tea = "black_tea",
  green_tea = "green_tea",
}
export interface Ingredients {
  hot_water: number;
  hot_milk: number;
  ginger_syrup: number;
  sugar_syrup: number;
  tea_leaves_syrup: number;
}

export class Inventory implements Ingredients {
  hot_water: number = 0;
  hot_milk: number = 0;
  ginger_syrup: number = 0;
  sugar_syrup: number = 0;
  tea_leaves_syrup: number = 0;
  constructor(raw: Ingredients) {
    this.add_ingredients(raw);
  }

  get_ingredients(req: Partial<Ingredients>) {
    return isGreaterThan(req, this);
  }
  remove_ingredients(raw: Partial<Ingredients>) {
    this.update_ingredients(raw, sub);
  }
  add_ingredients(raw: Partial<Ingredients>) {
    this.update_ingredients(raw, add);
  }
  update_ingredients(
    raw: Partial<Ingredients>,
    fnc: (num1?: number, num2?: number) => number
  ) {
    this.hot_milk = fnc(this.hot_milk, raw.hot_milk || 0);
    this.hot_water = fnc(this.hot_water, raw.hot_water || 0);
    this.ginger_syrup = fnc(this.ginger_syrup, raw.ginger_syrup || 0);
    this.sugar_syrup = fnc(this.sugar_syrup, raw.sugar_syrup || 0);
    this.tea_leaves_syrup = fnc(
      this.tea_leaves_syrup,
      raw.tea_leaves_syrup || 0
    );
  }
}

class InputParser {
  inventory: Inventory;
  constructor(input: Input) {
    this.inventory = new Inventory(input.machine.total_items_quantity);
  }
}
interface OutletCount {
  count_n: number;
}
export interface Input {
  machine: {
    outlets: OutletCount;
    total_items_quantity: Ingredients;
    beverages: { [key in BeverageType]: Partial<Ingredients> };
  };
}

export class CoffeeMachine {
  inventory: Inventory;
  beverages: { [key in BeverageType]: Partial<Ingredients> };
  outlets: { count_n: number };

  constructor(data: Input) {
    const parsed_input = new InputParser(data);
    this.inventory = parsed_input.inventory;
    this.beverages = data.machine.beverages;
    this.outlets = data.machine.outlets;
  }
  add_supply(raw: Partial<Ingredients>) {
    this.inventory.add_ingredients(raw);
  }
  remove_supply(raw: Partial<Ingredients>) {
    this.inventory.remove_ingredients(raw);
  }
  make_single_beverage(b_type: BeverageType) {
    const requirements = this.beverages[b_type];
    const cmp = this.inventory.get_ingredients(requirements);

    let obj: Response;

    if (!cmp.success) {
      obj = {
        label: b_type,
        message: `${b_type} cannot be prepared because ${cmp.key} is not available`,
      };
      return obj;
    }

    obj = { label: b_type, message: `${b_type} is prepared`, success: true };
    this.inventory.remove_ingredients(requirements);
    return obj;
  }
  get_beverages(beverage_types: Array<BeverageType>) {
    const res = new Array<Response>();

    if (beverage_types.length > this.outlets.count_n) {
      res.push({
        label: "Can not serve",
        message: `machine can only serve ${this.outlets.count_n} beverages at a time!`,
        success: false,
      });
      return res;
    }
    if (beverage_types.length == 0) {
      res.push({
        label: "Can not serve",
        message: `${0} beverages can not be served!`,
        success: false,
      });
      return res;
    }

    beverage_types.forEach((b) => {
      const obj = this.make_single_beverage(b);
      res.push(obj);
    });
    return res;
  }

  low_ingredients() {
    const max_requirements = Object.entries(this.beverages)
      .map((en) => en[1])
      .reduce((acc: { [key: string]: number }, it) => {
        Object.entries(it).forEach((en) => {
          acc[en[0]] = Math.max(acc[en[0]] || 0, en[1] || 0);
        });
        return acc;
      }, {});

    const inventory_ingr = Object.entries(this.inventory);

    const res = new Array<Response>();
    inventory_ingr.forEach((inv) => {
      if (max_requirements[inv[0]] > inv[1]) {
        res.push({
          label: inv[0],
          message: `${inv[0]} is running low`,
          success: false,
        });
      }
    });
    return res;
  }
}
