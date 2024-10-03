import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../entity/Product';
import { User } from '../entity/User';

export default class ProductController {
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const productRepository = getRepository(Product);
      const products = await productRepository.find();
      res.status(200).json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const productRepository = getRepository(Product);
      const product = await productRepository.findOne({ where: { id: productId } });

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
  
      const userRepository = getRepository(
        User
      );
      const seller = await userRepository.findOne({ where: { id: sellerId, role: 'seller' } });
  
      if (!seller) {
        res.status(404).json({ message: "Seller not found or user is not a seller" });
        return;
      }
  
      const productRepository = getRepository(Product);
      const newProduct = productRepository.create({
        name,
        description,
        price,
        stock,
        category,
        seller,  // Link the product to the seller (user with role 'seller')
      });
  
      await productRepository.save(newProduct);
      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error: any) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  


  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const productRepository = getRepository(Product);
      const product = await productRepository.findOne({ where: { id: productId } });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      const { name, description, price, stock, category } = req.body;
      product.name = name;
      product.description = description;
      product.price = price;
      product.stock = stock;
      product.category = category;

      await productRepository.save(product);
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      const productRepository = getRepository(Product);
      const product = await productRepository.findOne({ where: { id: productId } });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      await productRepository.remove(product);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
