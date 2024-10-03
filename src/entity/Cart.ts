import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User';  // Reference the User entity directly
import { Cart_Product } from './Cart_Product';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Reference the User entity directly
  @ManyToOne(() => User, user => user.carts)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  // Cart products
  @OneToMany(() => Cart_Product, cartProduct => cartProduct.cart)
  cartProducts!: Cart_Product[];
}
