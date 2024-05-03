import { OptionCategory } from "./option-category";

export class Option {
  id?: number;
  name: string;
  getirOptionId: string;
  price: number;
  optionCategoryId: number;
  optionCategory?: OptionCategory;
}
