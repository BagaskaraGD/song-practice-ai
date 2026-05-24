import { IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @IsIn(['credit_15', 'pro_monthly', 'pro_yearly'])
  product: string;
}
