import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  description?: string;
  notes?: string;
  image: string;
  isFavorite?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ClothingResponse {
  success: boolean;
  count?: number;
  message?: string;
  data: ClothingItem;
}

export interface ClothingListResponse {
  success: boolean;
  count?: number;
  message?: string;
  data: ClothingItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ClothingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/clothing';

  getClothingItems(): Observable<ClothingListResponse> {
    return this.http.get<ClothingListResponse>(this.apiUrl);
  }

  getClothingItem(id: string): Observable<ClothingResponse> {
    return this.http.get<ClothingResponse>(`${this.apiUrl}/${id}`);
  }

  addClothingItem(clothing: Partial<ClothingItem>): Observable<ClothingResponse> {
    return this.http.post<ClothingResponse>(this.apiUrl, clothing);
  }

  updateClothingItem(id: string, clothing: Partial<ClothingItem>): Observable<ClothingResponse> {
    return this.http.put<ClothingResponse>(`${this.apiUrl}/${id}`, clothing);
  }

  deleteClothingItem(id: string): Observable<{ success: boolean; message?: string }> {
    return this.http.delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${id}`);
  }
}
