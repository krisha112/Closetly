import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clothing-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clothing-details.html',
  styleUrl: './clothing-details.css',
})
export class ClothingDetails {
  @Input() clothing: any = null;

  @Output() backToWardrobe = new EventEmitter<void>();
  @Output() editClothing = new EventEmitter<any>();
  @Output() deleteClothingEvent = new EventEmitter<any>();

  showDeleteModal = false;
  imageLoaded = false;
  imageError = false;

  goBack(): void {
    this.backToWardrobe.emit();
  }

  edit(): void {
    if (!this.clothing) {
      return;
    }

    this.editClothing.emit(this.clothing);
  }

  openDeleteModal(): void {
    if (!this.clothing) {
      return;
    }

    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.clothing) {
      return;
    }

    this.showDeleteModal = false;
    this.deleteClothingEvent.emit(this.clothing);
  }

  onImageLoad(): void {
    this.imageLoaded = true;
    this.imageError = false;
  }

  onImageError(): void {
    this.imageLoaded = false;
    this.imageError = true;
  }

  getInitials(): string {
    if (!this.clothing?.name) {
      return 'CW';
    }

    const words = this.clothing.name
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  getDisplayValue(value: any, fallback = 'Not specified'): string {
    if (value === null || value === undefined || String(value).trim() === '') {
      return fallback;
    }

    return String(value);
  }
}
