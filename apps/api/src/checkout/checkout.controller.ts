import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './checkout.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator';

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  create(@Body() dto: CreateCheckoutDto, @CurrentUser() user: JwtUser) {
    return this.checkoutService.create(dto, user.sub);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.checkoutService.get(id);
  }
}
