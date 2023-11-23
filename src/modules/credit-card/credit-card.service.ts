import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreditCardDTO } from '../../dto/credit-card.dto';
import { DatabaseService } from '../../service/database.service';

@Injectable()
export class CardService {
  private readonly cardStorage: Map<string, CreditCardDTO> = new Map();

  constructor(private readonly databaseService: DatabaseService) {}

  async authorizeCard(cardDTO: CreditCardDTO, commerceId: string): Promise<any> {
    try {
      // Validación de la tarjeta de crédito
      this.validateCard(cardDTO);

      // Generación de token
      const token = this.generateToken();

      // Consulta del comercio
      const comercioExists = await this.checkComercio(commerceId);
      if (!comercioExists) {
        throw new HttpException('El comercio no existe', HttpStatus.NOT_FOUND);
      }

      // Almacenamiento seguro de los datos de la tarjeta en Redis (en este caso, en memoria)
      this.storeCardData(token, cardDTO);

      // Configurar el tiempo de expiración del almacenamiento
      setTimeout(() => this.deleteCardData(token), 15 * 60 * 1000); // 15 minutos en milisegundos

      return { message: 'Operación exitosa', token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private validateCard(cardDTO: CreditCardDTO): void {
    if (!this.luhnAlgorithm(cardDTO.card_number)) {
      throw new Error('Tarjeta de crédito no válida');
    }

    const allowedEmailDomains = ['gmail.com', 'hotmail.com', 'yahoo.es'];
    const emailDomain = cardDTO.email.split('@')[1];
    if (!allowedEmailDomains.includes(emailDomain)) {
      throw new Error('Correo electrónico no válido');
    }

    if (cardDTO.cvv.toString().length < 3 || cardDTO.cvv.toString().length > 4) {
      throw new Error('CVV no válido');
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    if (
      +cardDTO.expiration_year < currentYear ||
      (+cardDTO.expiration_year === currentYear && +cardDTO.expiration_month < currentMonth)
    ) {
      throw new Error('La tarjeta ha expirado');
    }
  }

  private luhnAlgorithm(cardNumber: string): boolean {
    const cardNumberStr = cardNumber.toString();
    let sum = 0;
    let double = false;

    for (let i = cardNumberStr.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumberStr[i], 10);

      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      double = !double;
    }

    return sum % 10 === 0;
  }

  private generateToken(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }

    return token;
  }

  private async checkComercio(commerceId: string): Promise<boolean> {
    try {
      const commerce = await this.databaseService.executeQuery(commerceId);

      return !!commerce; // Devuelve true si el comercio existe, de lo contrario, false.
    } catch (error) {
      console.error('Error al verificar el comercio:', error);
      return false; // En caso de error, asumimos que el comercio no existe
    }
  }

  private storeCardData(token: string, cardDTO: CreditCardDTO): void {
    // Almacena temporalmente los datos de la tarjeta en memoria (puedes adaptarlo a Redis).
    this.cardStorage.set(token, cardDTO);
  }

  private deleteCardData(token: string): void {
    // Elimina los datos de la tarjeta después de 15 minutos.
    this.cardStorage.delete(token);
  }
}