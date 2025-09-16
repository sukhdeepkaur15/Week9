import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html'
})
export class UpdateProductComponent implements OnInit {
  oid = '';
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.oid = this.route.snapshot.paramMap.get('oid') || '';
    this.api.list().subscribe(list => {
      const found = list.find(p => p._id === this.oid);
      if (found) this.form.patchValue(found as any);
    });
  }

  save() {
    if (!this.oid || this.form.invalid) return;
    this.api.update(this.oid, this.form.value as Partial<Product>).subscribe({
      next: () => this.router.navigate(['/products'])
    });
  }
}
