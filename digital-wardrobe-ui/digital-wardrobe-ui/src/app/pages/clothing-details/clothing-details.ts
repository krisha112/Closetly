import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-clothing-details',
  standalone: true,
  imports: [],
  templateUrl: './clothing-details.html',
  styleUrl: './clothing-details.css',
})
export class ClothingDetails {
  // --------------------------------------------------
  // CLOTHING RECEIVED FROM APP
  // --------------------------------------------------

  @Input()
  clothing: any = null;

  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  @Output()
  backToWardrobe = new EventEmitter<void>();

  @Output()
  editClothing = new EventEmitter<any>();

  @Output()
  deleteClothingEvent = new EventEmitter<any>();

  // --------------------------------------------------
  // GO BACK TO WARDROBE
  // --------------------------------------------------

  goBack() {
    this.backToWardrobe.emit();
  }

  // --------------------------------------------------
  // OPEN EDIT PAGE
  // --------------------------------------------------

  openEdit() {
    if (!this.clothing) {
      return;
    }

    this.editClothing.emit(this.clothing);
  }

  // --------------------------------------------------
  // DELETE CLOTHING
  // --------------------------------------------------

  deleteClothing() {
    if (!this.clothing) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete "${this.clothing.name}"?`);

    if (!confirmed) {
      return;
    }

    this.deleteClothingEvent.emit(this.clothing);
  }
}
