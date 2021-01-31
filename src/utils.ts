import { Inventory, Ingredients } from "./Infra";

export function sub(num1?: any, num2?: any) {
  if (num1 < num2) return num1;

  return Number(num1 || 0) - Number(num2 || 0);
}
export function add(num1?: any, num2?: any) {
  return Number(num1 || 0) + Number(num2 || 0);
}
export function dict(obj: any) {
  return Object.keys(obj).reduce((acc: { [key: string]: number }, key) => {
    acc[key] = Number(obj[key] || 0);
    return acc;
  }, {});
}

export function isGreaterThan(
  requirements: Partial<Ingredients>,
  inventory: Ingredients
): { success: boolean; key: any } {
  const requirements_dict = dict(requirements);
  const inventory_dict = dict(inventory);

  for (let key in inventory_dict) {
    if (requirements_dict[key] > inventory_dict[key]) {
      return { success: false, key };
    }
  }

  return { success: true, key: "" };
}
