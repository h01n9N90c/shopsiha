import { Product, Category } from '../types';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getFlashSaleProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  searchProducts(query: string): Promise<Product[]>;
  addProduct(product: Product): Promise<void>;
  updateProduct(product: Product): Promise<void>;
  deleteProduct(productId: string): Promise<void>;
}

export class ProductService implements IProductService {
  private productsKey = 'siha_products';
  private categoriesKey = 'siha_categories';

  constructor(products: Product[], categories: Category[]) {
    if (!localStorage.getItem(this.productsKey)) {
      localStorage.setItem(this.productsKey, JSON.stringify(products));
    }
    if (!localStorage.getItem(this.categoriesKey)) {
      localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    }
  }

  private getStoredProducts(): Product[] {
    const data = localStorage.getItem(this.productsKey);
    return data ? JSON.parse(data) : [];
  }

  private saveStoredProducts(products: Product[]) {
    localStorage.setItem(this.productsKey, JSON.stringify(products));
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getStoredProducts();
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    return this.getStoredProducts().filter(p => p.isFlashSale);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.getStoredProducts().filter(p => p.categoryId === categoryId);
  }

  async getCategories(): Promise<Category[]> {
    const data = localStorage.getItem(this.categoriesKey);
    return data ? JSON.parse(data) : [];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.getStoredProducts().filter(p => 
      p.name.vi.toLowerCase().includes(lowerQuery) || 
      p.name.en.toLowerCase().includes(lowerQuery)
    );
  }

  async addProduct(product: Product): Promise<void> {
    const products = this.getStoredProducts();
    products.push(product);
    this.saveStoredProducts(products);
  }

  async updateProduct(product: Product): Promise<void> {
    const products = this.getStoredProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
      this.saveStoredProducts(products);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const products = this.getStoredProducts();
    const filtered = products.filter(p => p.id !== productId);
    this.saveStoredProducts(filtered);
  }
}
