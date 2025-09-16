import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'] 
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private api: ProductService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.api.list().subscribe({
      next: (list) => { this.products = list; this.loading = false; },
      error: () => { this.error = 'Failed to load'; this.loading = false; }
    });
  }

  toAdd() { this.router.navigate(['/add']); }
  toEdit(p: Product) { if (p._id) this.router.navigate(['/update', p._id]); }

  remove(p: Product) {
    if (!p._id) return;
    if (!confirm(`Delete ${p.name}?`)) return;
    this.api.remove(p._id).subscribe({ next: () => this.load() });
  }
}

