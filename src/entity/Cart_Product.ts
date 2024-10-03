import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './Cart';
import { Product } from './Product';

@Entity()
export class Cart_Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Cart, cart => cart.cartProducts)
  cart!: Cart;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;
}
