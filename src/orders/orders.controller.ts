import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
  @ApiOperation({ summary: 'Получить список заказов текущего пользователя с фильтрацией и сортировкой' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  @Get()
  findOrders(
    @CurrentUser() user: any,
    @Query() query: FindOrdersQueryDto,
  ): Promise<Order[]> {
    return this.ordersService.findOrders(user, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get(':id')
  findOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOrderById(id);
  }
}
