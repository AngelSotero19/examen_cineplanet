// credit-card.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreditCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 16 })
  cardNumber: string;

  @Column({ length: 4 })
  cvv: string;

  @Column({ length: 2 })
  expirationMonth: string;

  @Column({ length: 4 })
  expirationYear: string;

  @Column({ length: 100 })
  email: string;
}
