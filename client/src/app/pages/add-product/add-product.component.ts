import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent {
  title = 'Add Product'; 
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private api: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      price: [0, [Validators.required]],
      units: [0, [Validators.required]]
    });
  }

  save() {
    if (this.form.invalid) return;
    this.api.add(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => this.error = err.error?.error || 'Failed to add'
    });
  }
}

