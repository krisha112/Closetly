
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClothingItem {
  _id?: string;
  id?: string | number;
  name: string;
  category: string;
  color?: string;
  brand?: string;
  season?: string;
  occasion?: string;
  size?: string;
  image?: string;
  notes?: string;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ClothingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/clothing';

  getClothingItems(): Observable<ApiResponse<ClothingItem[]>> {
  return this.http.get<ApiResponse<ClothingItem[]>>(
    `${this.apiUrl}?_=${Date.now()}`
  );
}

  addClothingItem(clothing: ClothingItem): Observable<ApiResponse<ClothingItem>> {
    return this.http.post<ApiResponse<ClothingItem>>(this.apiUrl, clothing);
  }

  updateClothingItem(
    id: string,
    clothing: Partial<ClothingItem>
  ): Observable<ApiResponse<ClothingItem>> {
    return this.http.put<ApiResponse<ClothingItem>>(
      `${this.apiUrl}/${id}`,
      clothing
    );
  }

  deleteClothingItem(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/${id}`
    );
  }
}
