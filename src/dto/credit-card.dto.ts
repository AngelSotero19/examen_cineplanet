// credit-card.dto.ts
import { IsCreditCard, IsEmail, IsInt, Length } from 'class-validator';

export class CreditCardDTO {
  @IsCreditCard()
  @Length(13, 16)
  card_number: string;

  @IsInt()
  @Length(3, 4)
  cvv: string;

  @IsInt()
  @Length(1, 2)
  expiration_month: string;

  @Length(4)
  expiration_year: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @Length(5, 100)
  email: string;
}
