import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import Order from '../model/order.entity';
import { FindOrdersQueryDto } from './dto/find-orders.dto';
import { PreviewOrderDto } from './dto/preview-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('preview')
  previewOrder(@Body() previewOrderDto: PreviewOrderDto) {
    return this.ordersService.previewOrder(previewOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('create')
  createOrder(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.ordersService.createOrder(user, createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Get()
  findOrders(
    @CurrentUser() user: any,
    @Query() query: FindOrdersQueryDto,
  ): Promise<Order[]> {
    return this.ordersService.findOrders(user, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Get(':id')
  findOrderById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Order> {
    return this.ordersService.findOrderById(id, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(
      orderId,
      dto.status,
      dto.managerComment,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id/tracking')
  updateTracking(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateTrackingDto,
  ): Promise<Order> {
    return this.ordersService.updateTracking(orderId, dto.trackingNumber);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Patch(':id/payment-status')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdatePaymentStatusDto,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(orderId, dto.paymentStatus);
  }
}
