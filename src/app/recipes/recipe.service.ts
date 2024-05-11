import { Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Traditional Lasagna', 
      'Easy and simple to make!', 
      'https://www.sabornamesa.com.br/media/k2/items/cache/13b5e0deaf19b06816d21e67ad4e211c_XL.jpg',
      [
        new Ingredient('Pasta', 3),
        new Ingredient('Meat', 1),
        new Ingredient('Cheese', 10),
      ]),
    new Recipe(
      'Steak Burguer', 
      'What else  you need to say?', 
      'https://swiftbr.vteximg.com.br/arquivos/ids/173303-768-768/steak-burguer-angus-seara-400g-615959-2.jpg?v=637541257659670000',
      [
        new Ingredient('Bread', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Cheese', 3),
      ])
  ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
