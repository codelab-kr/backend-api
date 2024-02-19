import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { Transfer } from './models/transfer';
import { CreateTransferInput } from './utils/create.transfer.input';

@Controller('transfer')
@ApiTags('TRANSFER API')
export class TransferController {
  constructor(private readonly transferervice: TransferService) {}

  @Get()
  @ApiOperation({ summary: '모든 TRANSFER 조회 API' })
  @ApiOkResponse({ description: '모든 TRANSFER를 조회한다.', type: Transfer })
  async findAll() {
    return await this.transferervice.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'TRANSFER 조회 API' })
  @ApiOkResponse({ description: 'TRANSFER을 조회한다.', type: Transfer })
  async findOne(@Param('id') id: number) {
    return await this.transferervice.findById(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'TRANSFER 생성 API',
    description: 'TRANSFER를 생성한다.',
  })
  @ApiCreatedResponse({ description: 'TRANSFER를 생성한다.', type: Transfer })
  async create(@Body() requestDto: CreateTransferInput) {
    return await this.transferervice.createTransfer(requestDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'TRANSFER 삭제 API',
    description: 'TRANSFER을 삭제한다.',
  })
  @ApiCreatedResponse({ description: 'TRANSFER를 생성한다.', type: Transfer })
  delete(@Param('id') id: number) {
    return this.transferervice.deleteTransfer(+id);
  }
}
