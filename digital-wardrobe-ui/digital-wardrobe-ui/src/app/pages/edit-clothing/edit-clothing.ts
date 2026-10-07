import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-clothing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-clothing.html',
  styleUrl: './edit-clothing.css',
})
export class EditClothing {
  // --------------------------------------------------
  // CLOTHING RECEIVED FROM DETAILS PAGE
  // --------------------------------------------------

  @Input()
  clothing: any = null;

  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------

  @Output()
  backToDetails = new EventEmitter<void>();

  @Output()
  clothingUpdated = new EventEmitter<any>();

  // --------------------------------------------------
  // LOCAL EDITABLE COPY
  // --------------------------------------------------

  editedClothing = {
    id: null as number | null,

    name: '',

    category: '',

    color: '',

    brand: '',

    size: '',

    season: '',

    occasion: '',

    notes: '',

    image: '',
  };

  // --------------------------------------------------
  // LOAD SELECTED CLOTHING
  // --------------------------------------------------

  ngOnChanges() {
    if (!this.clothing) {
      return;
    }

    // Create a separate copy so the original
    // clothing is not changed while editing.

    this.editedClothing = {
      id: this.clothing.id ?? null,

      name: this.clothing.name ?? '',

      category: this.clothing.category ?? '',

      color: this.clothing.color ?? '',

      brand: this.clothing.brand ?? '',

      size: this.clothing.size ?? '',

      season: this.clothing.season ?? '',

      occasion: this.clothing.occasion ?? '',

      notes: this.clothing.notes ?? '',

      image: this.clothing.image ?? '',
    };
  }

  // --------------------------------------------------
  // GO BACK
  // --------------------------------------------------

  goBack() {
    this.backToDetails.emit();
  }

  // --------------------------------------------------
  // SAVE CHANGES
  // --------------------------------------------------

  saveChanges() {
    // Basic validation

    if (!this.editedClothing.name.trim()) {
      alert('Please enter a clothing name.');

      return;
    }

    if (!this.editedClothing.category) {
      alert('Please select a category.');

      return;
    }

    // Create clean updated object

    const updatedClothing = {
      ...this.editedClothing,

      name: this.editedClothing.name.trim(),

      color: this.editedClothing.color.trim(),

      brand: this.editedClothing.brand.trim(),

      notes: this.editedClothing.notes.trim(),
    };

    console.log('Updated clothing:', updatedClothing);

    alert('Clothing updated successfully!');

    // Send updated clothing back to App

    this.clothingUpdated.emit(updatedClothing);
  }
}
