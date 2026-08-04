import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  id: string;
  presetId: string;
  title: string;
  shortDesc: string;
  category: string;
  price: string;
  cost: number;
  specs: any[];
  sku: string;
  studioImg?: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://nexuscommerce-1.onrender.com/api';
  public cartSignal = signal<CartItem[]>([]);

  constructor(private http: HttpClient) {
    this.getCart().subscribe();
  }

  public getCart(): Observable<CartItem[]> {
    return this.http.get<{ success: boolean; data: CartItem[] }>(`${this.apiUrl}/cart`).pipe(
      map(res => res.data || []),
      tap(items => this.cartSignal.set(items)),
      catchError(() => of([]))
    );
  }

  public addToCart(item: CartItem): Observable<CartItem[]> {
    return this.http.post<{ success: boolean; data: CartItem[] }>(`${this.apiUrl}/cart`, item).pipe(
      map(res => res.data || []),
      tap(items => this.cartSignal.set(items)),
      catchError(() => of(this.cartSignal()))
    );
  }

  public removeFromCart(itemId: string): Observable<CartItem[]> {
    return this.http.delete<{ success: boolean; data: CartItem[] }>(`${this.apiUrl}/cart/${itemId}`).pipe(
      map(res => res.data || []),
      tap(items => this.cartSignal.set(items)),
      catchError(() => of(this.cartSignal()))
    );
  }

  public exportToShopify(productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cart/export-shopify`, { productData }).pipe(
      catchError(err => of({ success: false, message: err.message }))
    );
  }
}
