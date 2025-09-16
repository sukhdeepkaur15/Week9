import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id?: string;
  id: number;
  name: string;
  description: string;
  price: number;
  units: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = 'http://localhost:3000'; // change if your API uses another port
  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }
  add(p: Product): Observable<Product> {
    return this.http.post<Product>(`${this.base}/products`, p);
  }
  update(oid: string, p: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${oid}`, p);
  }
  remove(oid: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/products/${oid}`);
  }
}
