import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ClothingItem {
  _id?: string;
  id?: string | number;
  name: string;
  category: string;
  color: string;
  brand: string;
  size: string;
  season: string;
  occasion: string;
  description: string;
  notes?: string;
  image: string;
  isFavorite?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

@Component({
  selector: 'app-edit-clothing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-clothing.html',
  styleUrl: './edit-clothing.css',
})
export class EditClothingComponent implements OnInit, OnChanges, OnDestroy {
  @Input() clothing: ClothingItem | null = null;

  @Output() clothingUpdated = new EventEmitter<ClothingItem>();
  @Output() backToDetails = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  editedClothing: ClothingItem = this.createEmptyClothing();

  categories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

  colors = [
    'Black',
    'White',
    'Grey',
    'Gray',
    'Brown',
    'Beige',
    'Cream',
    'Blue',
    'Navy',
    'Green',
    'Olive',
    'Red',
    'Pink',
    'Mauve',
    'Purple',
    'Yellow',
    'Orange',
    'Floral',
    'Multicolour',
    'Other',
  ];

  sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'XXXL',
    '28',
    '30',
    '32',
    '34',
    '36',
    '38',
    '40',
    '6',
    '7',
    '8',
    '9',
    '10',
    'One Size',
  ];

  seasons = ['All Season', 'Summer', 'Winter', 'Monsoon', 'Spring', 'Autumn'];

  occasions = [
    'Casual',
    'Formal',
    'Semi Formal',
    'Party',
    'Work',
    'Vacation',
    'Sport',
    'Traditional',
  ];

  selectedImageFile: File | null = null;
  imagePreview = '';

  isSaving = false;
  errorMessage = '';
  showSuccess = false;

  private previewObjectUrl: string | null = null;
  private successTimer: ReturnType<typeof setTimeout> | null = null;
  private originalClothing: ClothingItem | null = null;
  private submitted = false;

  private readonly cloudName = 'm7n65aiw';
  private readonly uploadPreset = 'closetly_uploads';

  ngOnInit(): void {
    this.loadClothing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clothing']) {
      this.loadClothing();
    }
  }

  ngOnDestroy(): void {
    this.clearPreviewObjectUrl();

    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }
  }

  private createEmptyClothing(): ClothingItem {
    return {
      name: '',
      category: 'Tops',
      color: '',
      brand: '',
      size: '',
      season: 'All Season',
      occasion: 'Casual',
      description: '',
      notes: '',
      image: '',
    };
  }

  private clearPreviewObjectUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
  }

  private loadClothing(): void {
    this.clearPreviewObjectUrl();
    this.selectedImageFile = null;
    this.errorMessage = '';
    this.showSuccess = false;
    this.submitted = false;

    if (!this.clothing) {
      this.editedClothing = this.createEmptyClothing();
      this.originalClothing = null;
      this.imagePreview = '';
      return;
    }

    this.editedClothing = {
      ...this.createEmptyClothing(),
      ...this.clothing,
      notes: this.clothing.notes ?? this.clothing.description ?? '',
      _id: this.clothing._id,
      id: this.clothing.id,
    };

    this.originalClothing = { ...this.editedClothing };
    this.imagePreview = this.editedClothing.image || '';
  }

  goBack(): void {
    this.clearPreviewObjectUrl();
    this.backToDetails.emit();
    this.cancel.emit();
  }

  getFieldError(field: string): boolean {
    if (!this.submitted) {
      return false;
    }

    const value = this.editedClothing[field as keyof ClothingItem];

    if (typeof value !== 'string') {
      return !value;
    }

    return !value.trim();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Please select a JPG, PNG, WEBP, or GIF image.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'The image must be 5 MB or smaller.';
      input.value = '';
      return;
    }

    this.clearPreviewObjectUrl();

    this.selectedImageFile = file;
    this.previewObjectUrl = URL.createObjectURL(file);
    this.imagePreview = this.previewObjectUrl;

    this.errorMessage = '';
    this.showSuccess = false;
  }

  onImageUrlChange(): void {
    if (this.selectedImageFile) {
      this.selectedImageFile = null;

      const fileInput = document.getElementById('editImageFile') as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = '';
      }
    }

    this.clearPreviewObjectUrl();
    this.imagePreview = this.editedClothing.image || '';
    this.errorMessage = '';
  }

  removeSelectedImage(): void {
    this.clearPreviewObjectUrl();
    this.selectedImageFile = null;
    this.editedClothing.image = '';
    this.imagePreview = '';

    const fileInput = document.getElementById('editImageFile') as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }

    this.errorMessage = '';
  }

  onImageError(): void {
    this.imagePreview = '';
  }

  resetChanges(): void {
    if (!this.originalClothing) {
      return;
    }

    this.clearPreviewObjectUrl();
    this.selectedImageFile = null;
    this.editedClothing = { ...this.originalClothing };
    this.imagePreview = this.editedClothing.image || '';
    this.errorMessage = '';
    this.showSuccess = false;
    this.submitted = false;

    const fileInput = document.getElementById('editImageFile') as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = '';
    }
  }

  private async uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'closetly');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
      console.error('Cloudinary upload failed:', result);
      throw new Error(result?.error?.message || 'The image upload failed. Please try again.');
    }

    return result.secure_url as string;
  }

  async saveChanges(): Promise<void> {
    this.submitted = true;

    if (!this.clothing) {
      this.errorMessage = 'No clothing item was selected for editing.';
      return;
    }

    if (this.isSaving) {
      return;
    }

    if (
      !this.editedClothing.name.trim() ||
      !this.editedClothing.category ||
      !this.editedClothing.color.trim() ||
      !this.editedClothing.size.trim() ||
      !this.editedClothing.occasion.trim()
    ) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.showSuccess = false;

    try {
      let imageUrl = (this.editedClothing.image || '').trim();

      if (this.selectedImageFile) {
        imageUrl = await this.uploadImageToCloudinary(this.selectedImageFile);
      }

      const notes = (this.editedClothing.notes ?? '').trim();

      const updatedClothing: ClothingItem = {
        ...this.editedClothing,
        name: this.editedClothing.name.trim(),
        category: this.editedClothing.category.trim(),
        color: this.editedClothing.color.trim(),
        brand: this.editedClothing.brand.trim(),
        size: this.editedClothing.size.trim(),
        season: this.editedClothing.season.trim(),
        occasion: this.editedClothing.occasion.trim(),
        notes,
        description: notes || this.editedClothing.description || '',
        image: imageUrl,
        _id: this.clothing._id,
        id: this.clothing.id,
      };

      this.clothingUpdated.emit(updatedClothing);

      this.originalClothing = { ...updatedClothing };
      this.editedClothing = { ...updatedClothing };
      this.selectedImageFile = null;

      this.clearPreviewObjectUrl();
      this.imagePreview = imageUrl;
      this.showSuccess = true;

      if (this.successTimer) {
        clearTimeout(this.successTimer);
      }

      this.successTimer = setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    } catch (error) {
      console.error('Unable to save clothing changes:', error);
      this.errorMessage =
        error instanceof Error ? error.message : 'Something went wrong while uploading the image.';
    } finally {
      this.isSaving = false;
    }
  }

  cancelEdit(): void {
    this.goBack();
  }
}
