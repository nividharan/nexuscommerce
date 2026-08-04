import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  shortDesc: string;
  category: string;
  cost: number;
  specs: ProductSpec[];
  tags: string[];
  sku: string;
  rawNotes?: string;
  rawImg?: string;
  studioImg?: string;
}

export interface ProductResponse {
  success: boolean;
  count?: number;
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://nexuscommerce-1.onrender.com/api';

  public productsSignal = signal<Product[]>([]);
  public loadingSignal = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  public getProducts(): Observable<Product[]> {
    this.loadingSignal.set(true);
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`).pipe(
      map(res => res.data || []),
      tap(products => {
        this.productsSignal.set(products);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        console.warn('[ProductService] Error fetching catalog:', err.message);
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  public getProductById(id: string): Observable<Product | null> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.apiUrl}/products/${id}`).pipe(
      map(res => res.data || null),
      catchError(err => {
        console.warn('[ProductService] Error fetching product details:', err.message);
        return of(null);
      })
    );
  }
}
