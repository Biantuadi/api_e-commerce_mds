import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Order } from './Order';  // Import the Order entity
import { Product } from './Product';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  firstname!: string;

  @Column({ type: 'varchar', length: 100 })
  lastname!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string;

  @Column({ type: 'varchar' })
  role!: string;  // Role can be 'buyer', 'seller', or 'admin'

  @CreateDateColumn()
  createdAt!: Date;

  // For buyers, reference their orders
  @OneToMany(() => Order, order => order.user)
  orders!: Order[];

  // For sellers, reference their products
  @OneToMany(() => Product, product => product.seller)
  products!: Product[];
  carts: any;
}
