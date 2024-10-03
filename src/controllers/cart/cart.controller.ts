import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Cart } from '../../entity/Cart';
import { Cart_Product } from '../../entity/Cart_Product';
import { Product } from '../../entity/Product';
import { User } from '../../entity/User';  // Updated to use User instead of Buyer

export default class CartController {
  public async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;  // Get the user ID from the token
      const cartRepository = getRepository(Cart);
      
      // Find the cart for the user (who acts as a buyer)
      const cart = await cartRepository.findOne({
        where: { user: { id: userId } },  // Update to reference User instead of Buyer
        relations: ['cartProducts', 'cartProducts.product']
      });

      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const userId = (req.body.user as { userID: string }).userID;  // Get the user ID from the token

      const productRepository = getRepository(Product);
      const cartRepository = getRepository(Cart);
      const cartProductRepository = getRepository(Cart_Product);

      // Check if the product exists
      const product = await productRepository.findOne({ where: { id: productId } });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      // Find the cart for the user (acting as a buyer), or create a new one
      let cart = await cartRepository.findOne({ where: { user: { id: userId } } });  // Reference User instead of Buyer

      if (!cart) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        cart = cartRepository.create({ user });
        await cartRepository.save(cart);
      }

      // Check if the product is already in the cart
      let cartProduct = await cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: product.id } } });
      if (cartProduct) {
        // Update the quantity
        cartProduct.quantity += quantity;
      } else {
        // Add a new product to the cart
        cartProduct = cartProductRepository.create({ cart, product, quantity });
      }

      await cartProductRepository.save(cartProduct);
      res.status(201).json({ message: "Product added to cart", cartProduct });
    } catch (error: any) {
      console.error("Error adding product to cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateProductQuantity(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      const userId = (req.body.user as { userID: string }).userID;  // Get the user ID from the token

      const cartProductRepository = getRepository(Cart_Product);
      const cartRepository = getRepository(Cart);

      const cart = await cartRepository.findOne({ where: { user: { id: userId } } });  // Reference User instead of Buyer
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      const cartProduct = await cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
      if (!cartProduct) {
        res.status(404).json({ message: "Product not found in cart" });
        return;
      }

      cartProduct.quantity = quantity;
      await cartProductRepository.save(cartProduct);

      res.status(200).json({ message: "Product quantity updated", cartProduct });
    } catch (error: any) {
      console.error("Error updating product quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async removeProductFromCart(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.productId;
      const userId = (req.body.user as { userID: string }).userID;  // Get the user ID from the token

      const cartProductRepository = getRepository(Cart_Product);
      const cartRepository = getRepository(Cart);

      const cart = await cartRepository.findOne({ where: { user: { id: userId } } });  // Reference User instead of Buyer
      if (!cart) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }

      const cartProduct = await cartProductRepository.findOne({ where: { cart: { id: cart.id }, product: { id: productId } } });
      if (!cartProduct) {
        res.status(404).json({ message: "Product not found in cart" });
        return;
      }

      await cartProductRepository.remove(cartProduct);
      res.status(200).json({ message: "Product removed from cart" });
    } catch (error: any) {
      console.error("Error removing product from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
