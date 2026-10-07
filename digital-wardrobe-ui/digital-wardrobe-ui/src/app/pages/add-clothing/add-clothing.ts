import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-clothing',
  standalone: true,

  imports: [FormsModule],

  templateUrl: './add-clothing.html',
  styleUrl: './add-clothing.css',
})
export class AddClothing {
  // ==================================================
  // EVENTS
  // ==================================================

  @Output()
  backToWardrobe = new EventEmitter<void>();

  @Output()
  clothingSaved = new EventEmitter<any>();

  // ==================================================
  // IMAGE PREVIEW
  // ==================================================

  imagePreview = '';

  // ==================================================
  // IN-PAGE MESSAGE
  // ==================================================

  messageVisible = false;

  messageText = '';

  messageType: 'success' | 'error' | 'info' = 'success';

  // ==================================================
  // CLOTHING FORM
  // ==================================================

  clothing = {
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

  // ==================================================
  // GO BACK
  // ==================================================

  goBack() {
    this.backToWardrobe.emit();
  }

  // ==================================================
  // IMAGE SELECTION
  // ==================================================

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Check image type

    if (!file.type.startsWith('image/')) {
      this.showMessage('Please select a valid image file.', 'error');

      input.value = '';

      return;
    }

    // Limit image size to 5 MB

    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('Please select an image smaller than 5 MB.', 'error');

      input.value = '';

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;

      this.clothing.image = this.imagePreview;
    };

    reader.onerror = () => {
      this.showMessage('Something went wrong while loading the image.', 'error');
    };

    reader.readAsDataURL(file);
  }

  // ==================================================
  // REMOVE IMAGE
  // ==================================================

  removeImage() {
    this.imagePreview = '';

    this.clothing.image = '';
  }

  // ==================================================
  // SAVE CLOTHING
  // ==================================================

  saveClothing() {
    // ----------------------------------------------
    // Validate clothing name
    // ----------------------------------------------

    if (!this.clothing.name.trim()) {
      this.showMessage('Please enter a clothing name.', 'error');

      return;
    }

    // ----------------------------------------------
    // Validate category
    // ----------------------------------------------

    if (!this.clothing.category) {
      this.showMessage('Please select a category.', 'error');

      return;
    }

    // ----------------------------------------------
    // Create clean clothing object
    // ----------------------------------------------

    const savedClothing = {
      ...this.clothing,

      name: this.clothing.name.trim(),

      color: this.clothing.color.trim(),

      brand: this.clothing.brand.trim(),

      notes: this.clothing.notes.trim(),
    };

    console.log('Clothing saved:', savedClothing);

    // ----------------------------------------------
    // Send clothing to App
    // ----------------------------------------------

    this.clothingSaved.emit(savedClothing);

    // ----------------------------------------------
    // Show success message
    // ----------------------------------------------

    this.showMessage('Clothing added to your wardrobe.', 'success');

    // ----------------------------------------------
    // Reset form
    // ----------------------------------------------

    this.resetForm();
  }

  // ==================================================
  // RESET FORM
  // ==================================================

  resetForm() {
    this.clothing = {
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

    this.imagePreview = '';
  }

  // ==================================================
  // SHOW MESSAGE
  // ==================================================

  showMessage(
    message: string,

    type: 'success' | 'error' | 'info' = 'success',
  ) {
    this.messageText = message;

    this.messageType = type;

    this.messageVisible = true;

    setTimeout(() => {
      this.messageVisible = false;
    }, 3500);
  }

  // ==================================================
  // CLOSE MESSAGE
  // ==================================================

  closeMessage() {
    this.messageVisible = false;
  }
}
