import { Request, Response } from 'express';
import ProductService from '../services/product.service';

const productService = new ProductService();

export default class ProductController {
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const product = await productService.getProductById(productId);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json(product);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, price, stock, category } = req.body;
      const sellerId = (req.body.user as { userID: string }).userID;

      const newProduct = await productService.addProduct(
        { name, description, price, stock, category },
        sellerId
      );

      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error: any) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const { name, description, price, stock, category } = req.body;

      const updatedProduct = await productService.updateProduct(productId, {
        name,
        description,
        price,
        stock,
        category,
      });

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      await productService.deleteProduct(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
