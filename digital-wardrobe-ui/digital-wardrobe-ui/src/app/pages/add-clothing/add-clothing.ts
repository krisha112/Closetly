import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-clothing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-clothing.html',
  styleUrl: './add-clothing.css',
})
export class AddClothing implements OnDestroy {
  @Output() backToWardrobe = new EventEmitter<void>();
  @Output() clothingSaved = new EventEmitter<any>();

  private readonly cloudName = 'm7n65aiw';
  private readonly uploadPreset = 'closetly_uploads';

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
  selectedImageFile: File | null = null;

  submitted = false;
  showSuccess = false;
  errorMessage = '';
  isUploading = false;

  private successTimer: ReturnType<typeof setTimeout> | null = null;
  private previewObjectUrl: string | null = null;

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

  goBack(): void {
    if (this.isUploading) {
      return;
    }

    this.backToWardrobe.emit();
  }

  onImageUrlChange(): void {
    if (this.selectedImageFile) {
      return;
    }

    this.imagePreview = (this.clothing.image || '').trim();
    this.errorMessage = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.errorMessage = '';

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Please select a JPG, PNG, WEBP, or GIF image.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'The image must be smaller than 5 MB.';
      input.value = '';
      return;
    }

    this.clearPreviewObjectUrl();

    this.selectedImageFile = file;
    this.previewObjectUrl = URL.createObjectURL(file);
    this.imagePreview = this.previewObjectUrl;
    this.clothing.image = '';
  }

  clearSelectedImage(): void {
    this.clearPreviewObjectUrl();
    this.selectedImageFile = null;
  }

  removeSelectedImage(): void {
    this.clearSelectedImage();
    this.imagePreview = '';
    this.clothing.image = '';

    const input = document.getElementById('imageFile') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }

    this.errorMessage = '';
  }

  onImageError(): void {
    this.imagePreview = '';
    this.errorMessage =
      'The image could not be displayed. Please select another image or check the URL.';
  }

  isFormValid(): boolean {
    return (
      this.clothing.name.trim().length > 0 &&
      this.clothing.category.trim().length > 0 &&
      this.clothing.color.trim().length > 0 &&
      this.clothing.size.trim().length > 0 &&
      this.clothing.occasion.trim().length > 0
    );
  }

  async saveClothing(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';

    if (this.isUploading) {
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Please complete all required fields before saving.';
      return;
    }

    this.isUploading = true;

    try {
      let imageUrl = (this.clothing.image || '').trim();

      if (this.selectedImageFile) {
        imageUrl = await this.uploadImageToCloudinary(this.selectedImageFile);
      }

      const newClothing = {
        ...this.clothing,
        name: this.clothing.name.trim(),
        category: this.clothing.category.trim(),
        color: this.clothing.color.trim(),
        brand: this.clothing.brand.trim(),
        size: this.clothing.size.trim(),
        season: this.clothing.season.trim(),
        occasion: this.clothing.occasion.trim(),
        image: imageUrl,
        notes: this.clothing.notes.trim(),
      };

      // The parent component handles saving the item to MongoDB.
      this.clothingSaved.emit(newClothing);

      this.showSuccess = true;

      if (this.successTimer) {
        clearTimeout(this.successTimer);
      }

      this.successTimer = setTimeout(() => {
        this.showSuccess = false;
        this.successTimer = null;
      }, 2500);
    } catch (error) {
      console.error('Clothing image upload failed:', error);

      this.errorMessage =
        error instanceof Error ? error.message : 'Unable to upload the image. Please try again.';
    } finally {
      this.isUploading = false;
    }
  }

  private async uploadImageToCloudinary(file: File): Promise<string> {
    const endpoint = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'closetly');

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          'Cloudinary rejected the upload. Check your upload preset settings.',
      );
    }

    if (!result.secure_url) {
      throw new Error('Cloudinary did not return an image URL. Please try again.');
    }

    return result.secure_url as string;
  }

  resetForm(): void {
    this.clearSelectedImage();

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
    this.showSuccess = false;

    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = null;
    }
  }

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

  private clearPreviewObjectUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
  }

  ngOnDestroy(): void {
    this.clearSelectedImage();

    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = null;
    }
  }
}
