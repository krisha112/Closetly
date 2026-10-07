import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-clothing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-clothing.html',
  styleUrl: './add-clothing.css',
})
export class AddClothing {
  @Output() backToWardrobe = new EventEmitter<void>();
  @Output() clothingSaved = new EventEmitter<any>();

  clothing = {
    name: '',
    category: 'Tops',
    color: '',
    brand: '',
    size: '',
    season: 'All Season',
    occasion: 'Casual',
    image: '',
    notes: '',
  };

  imagePreview = '';

  submitted = false;
  showSuccess = false;
  errorMessage = '';

  categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

  colors = [
    'Black',
    'White',
    'Brown',
    'Beige',
    'Cream',
    'Blue',
    'Green',
    'Olive',
    'Mauve',
    'Pink',
    'Red',
    'Grey',
    'Yellow',
    'Other',
  ];

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'One Size'];

  seasons = ['All Season', 'Summer', 'Winter', 'Spring', 'Monsoon'];

  occasions = ['Casual', 'Formal', 'Semi Formal', 'Party', 'College', 'Work', 'Travel', 'Sports'];

  /* =====================================================
     NAVIGATION
  ===================================================== */

  goBack(): void {
    this.backToWardrobe.emit();
  }

  /* =====================================================
     IMAGE
  ===================================================== */

  onImageUrlChange(): void {
    this.imagePreview = this.clothing.image.trim();

    if (this.imagePreview) {
      this.errorMessage = '';
    }
  }

  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  isFormValid(): boolean {
    return (
      this.clothing.name.trim().length > 0 &&
      this.clothing.category.trim().length > 0 &&
      this.clothing.color.trim().length > 0 &&
      this.clothing.size.trim().length > 0 &&
      this.clothing.occasion.trim().length > 0
    );
  }

  /* =====================================================
     SAVE
  ===================================================== */

  saveClothing(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields before saving.';
      return;
    }

    const newClothing = {
      ...this.clothing,
      name: this.clothing.name.trim(),
      color: this.clothing.color.trim(),
      brand: this.clothing.brand.trim(),
      size: this.clothing.size.trim(),
      image: this.clothing.image.trim(),
      notes: this.clothing.notes.trim(),
    };

    this.clothingSaved.emit(newClothing);

    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;
    }, 2500);
  }

  /* =====================================================
     RESET
  ===================================================== */

  resetForm(): void {
    this.clothing = {
      name: '',
      category: 'Tops',
      color: '',
      brand: '',
      size: '',
      season: 'All Season',
      occasion: 'Casual',
      image: '',
      notes: '',
    };

    this.imagePreview = '';
    this.submitted = false;
    this.errorMessage = '';
  }

  /* =====================================================
     FIELD HELPERS
  ===================================================== */

  getFieldError(field: string): boolean {
    if (!this.submitted) {
      return false;
    }

    switch (field) {
      case 'name':
        return !this.clothing.name.trim();

      case 'color':
        return !this.clothing.color.trim();

      case 'size':
        return !this.clothing.size.trim();

      case 'occasion':
        return !this.clothing.occasion.trim();

      default:
        return false;
    }
  }
}
