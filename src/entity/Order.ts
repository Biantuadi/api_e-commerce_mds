import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';  // Referencing the User entity

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Reference the User entity, who is acting as the buyer
  @ManyToOne(() => User, user => user.orders)
  user!: User;

  @Column({ type: 'varchar' })
  status!: string;

  @Column({ type: 'decimal' })
  total_amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'text' })
  shipping_address!: string;

  @Column('simple-array')
  product_ids!: string[];  // Store product IDs as a simple array
}
