import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { RecipeService } from './recipe.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverResolver implements Resolve<Recipe[]> {

  
  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]>{
    const recipes = this.recipeService.getRecipes();

    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else{
      return of(recipes);
    }
  }
}
