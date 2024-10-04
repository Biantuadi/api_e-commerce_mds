import { getRepository } from 'typeorm';
import { Cart } from '../entity/Cart';
import { Cart_Product } from '../entity/Cart_Product';
import { Product } from '../entity/Product';
import { User } from '../entity/User';

export class CartService {
  private cartRepository = getRepository(Cart);
  private cartProductRepository = getRepository(Cart_Product);
  private productRepository = getRepository(Product);
  private userRepository = getRepository(User);

  // Get user's cart
  public async getCart(userId: string) {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartProducts', 'cartProducts.product']
    });
  }

  // Add product to cart
  public async addProductToCart(userId: string, productId: string, quantity: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    let cart = await this.cartRepository.findOne({ where: { user: { id: userId } } });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    let cartProduct = await this.cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: product.id } } });

    if (cartProduct) {
      cartProduct.quantity += quantity; // Update quantity if already exists
    } else {
      cartProduct = this.cartProductRepository.create({ cart, product, quantity });
    }

    await this.cartProductRepository.save(cartProduct);
    return cartProduct;
  }

  // Update product quantity in cart
  public async updateProductQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.cartRepository.findOne({ where: { user: { id: userId } } });
    if (!cart) throw new Error("Cart not found");

    const cartProduct = await this.cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
    if (!cartProduct) throw new Error("Product not found in cart");

    cartProduct.quantity = quantity;
    await this.cartProductRepository.save(cartProduct);
    return cartProduct;
  }

  // Remove product from cart
  public async removeProductFromCart(userId: string, productId: string) {
    const cart = await this.cartRepository.findOne({ where: { user: { id: userId } } });
    if (!cart) throw new Error("Cart not found");

    const cartProduct = await this.cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
    if (!cartProduct) throw new Error("Product not found in cart");

    await this.cartProductRepository.remove(cartProduct);
  }
}
