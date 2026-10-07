import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-clothing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-clothing.html',
  styleUrl: './edit-clothing.css',
})
export class EditClothing {
  @Input() clothing: any = null;

  @Output() backToDetails = new EventEmitter<void>();
  @Output() clothingUpdated = new EventEmitter<any>();

  editedClothing: any = null;

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

  ngOnInit(): void {
    this.prepareClothing();
  }

  ngOnChanges(): void {
    this.prepareClothing();
  }

  private prepareClothing(): void {
    if (!this.clothing) {
      this.editedClothing = null;
      this.imagePreview = '';
      return;
    }

    this.editedClothing = {
      id: this.clothing.id,
      name: this.clothing.name || '',
      category: this.clothing.category || 'Tops',
      color: this.clothing.color || '',
      brand: this.clothing.brand || '',
      size: this.clothing.size || '',
      season: this.clothing.season || 'All Season',
      occasion: this.clothing.occasion || 'Casual',
      image: this.clothing.image || '',
      notes: this.clothing.notes || '',
    };

    this.imagePreview = this.editedClothing.image;
    this.submitted = false;
    this.errorMessage = '';
    this.showSuccess = false;
  }

  goBack(): void {
    this.backToDetails.emit();
  }

  onImageUrlChange(): void {
    if (!this.editedClothing) {
      return;
    }

    this.imagePreview = this.editedClothing.image.trim();

    if (this.imagePreview) {
      this.errorMessage = '';
    }
  }

  isFormValid(): boolean {
    if (!this.editedClothing) {
      return false;
    }

    return (
      this.editedClothing.name.trim().length > 0 &&
      this.editedClothing.category.trim().length > 0 &&
      this.editedClothing.color.trim().length > 0 &&
      this.editedClothing.size.trim().length > 0 &&
      this.editedClothing.occasion.trim().length > 0
    );
  }

  saveChanges(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.editedClothing) {
      this.errorMessage = 'No clothing piece is selected for editing.';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields before saving.';
      return;
    }

    const updatedClothing = {
      ...this.editedClothing,
      name: this.editedClothing.name.trim(),
      category: this.editedClothing.category.trim(),
      color: this.editedClothing.color.trim(),
      brand: this.editedClothing.brand.trim(),
      size: this.editedClothing.size.trim(),
      season: this.editedClothing.season.trim(),
      occasion: this.editedClothing.occasion.trim(),
      image: this.editedClothing.image.trim(),
      notes: this.editedClothing.notes.trim(),
    };

    this.editedClothing = updatedClothing;
    this.imagePreview = updatedClothing.image;

    this.clothingUpdated.emit(updatedClothing);

    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;
    }, 2500);
  }

  resetChanges(): void {
    this.prepareClothing();
  }

  getFieldError(field: string): boolean {
    if (!this.submitted || !this.editedClothing) {
      return false;
    }

    switch (field) {
      case 'name':
        return !this.editedClothing.name.trim();

      case 'color':
        return !this.editedClothing.color.trim();

      case 'size':
        return !this.editedClothing.size.trim();

      case 'occasion':
        return !this.editedClothing.occasion.trim();

      default:
        return false;
    }
  }
}
