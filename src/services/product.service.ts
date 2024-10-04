import { getRepository } from 'typeorm';
import { Product } from '../entity/Product';
import { User } from '../entity/User';

export default class ProductService {
  public async getAllProducts() {
    const productRepository = getRepository(Product);
    return await productRepository.find();
  }

  public async getProductById(productId: string) {
    const productRepository = getRepository(Product);
    return await productRepository.findOne({ where: { id: productId } });
  }

  public async addProduct(productData: Partial<Product>, sellerId: string) {
    const userRepository = getRepository(User);
    const seller = await userRepository.findOne({ where: { id: sellerId, role: 'seller' } });

    if (!seller) {
      throw new Error('Seller not found or user is not a seller');
    }

    const productRepository = getRepository(Product);
    const newProduct = productRepository.create({
      ...productData,
      seller,
    });

    return await productRepository.save(newProduct);
  }

  public async updateProduct(productId: string, productData: Partial<Product>) {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, productData);
    return await productRepository.save(product);
  }

  public async deleteProduct(productId: string) {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error('Product not found');
    }

    await productRepository.remove(product);
  }
}
