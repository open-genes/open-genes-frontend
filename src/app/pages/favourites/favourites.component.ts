import { Injectable } from '@angular/core';
import { Genes } from 'src/app/core/models/genes.model';
import { FavouritesService } from 'src/app/core/services/favourites.service';

const favedGeneStorageKey = 'Todo_List';

const favsMap = new Map();

@Injectable()
export class FavouritesComponent {
  favedGene: Genes[];

  constructor(private storageService: FavouritesService) {
    this.favedGene =
      storageService.getData(favedGeneStorageKey) || favsMap;
  }

  saveList() {
    this.storageService.setData(favedGeneStorageKey, this.favedGene);
  }

  addItem(item: Genes) {
    this.favedGene.push(item);
    this.saveList();
  }

  updateItem(item, changes) {
    const index = this.favedGene.indexOf(item);
    this.favedGene[index] = { ...item, ...changes };
    this.saveList();
  }

  deleteItem(item) {
    const index = this.favedGene.indexOf(item);
    this.favedGene.splice(index, 1);
    this.saveList();
  }
  getTodoList() {
    return this.favedGene;
  }
}
