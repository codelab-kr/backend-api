import { NotFoundException, Injectable } from '@nestjs/common';
import { Transfer } from './models/transfer';
import { isEmpty, TransferMessage } from '@app/common';
import { CreateTransferInput } from './utils/create.transfer.input';
import { UpdateTransferInput } from './utils/update.transfer.ipnput';
import { TransferRepository } from './repositories/transfer.repository';

@Injectable()
export class TransferService {
  constructor(private readonly transferRepository: TransferRepository) {}

  /**
   * TRANSFER를 생성한다.
   *
   * @param {TransferCreateRequestDto} requestDto - TRANSFER 생성 Dto
   * @returns {Promise<Transfer>}
   */
  createTransfer(requestDto: CreateTransferInput): Promise<Transfer> {
    return this.transferRepository.save(requestDto);
  }

  /**
   * 모든 TRANSFER 정보를 조회한다.
   *
   * @returns {Promise<Transfer[]>}
   */
  findAll(): Promise<Transfer[]> {
    return this.transferRepository.find({ relations: ['settings'] });
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER 정보를 조회한다.
   *
   * @param {number} id - TRANSFER Id
   * @returns {Promise<TransferResponseDto>}
   */
  findById(id: number): Promise<Transfer> {
    return this.findTransferById(id);
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER 정보를 수정한다.
   *
   * @param {number} id - TRANSFER Id
   * @param {TransferUpdateRequestDto} requestDto - TRANSFER 수정 Dto
   * @returns {Promise<Transfer>}
   */
  async updateTransfer(requestDto: UpdateTransferInput): Promise<Transfer> {
    const transfer = await this.findTransferById(requestDto.id);
    const { userId } = requestDto;
    const updateTransfer = { ...transfer, userId };
    return this.transferRepository.save(updateTransfer);
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER 정보를 반환한다.
   *
   * @param {number} id - TRANSFER Id
   * @returns {Promise<Transfer>}
   * @private
   */
  private async findTransferById(id: number): Promise<Transfer> {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: ['settings'],
    });

    if (isEmpty(transfer) === true) {
      throw new NotFoundException(TransferMessage.NOT_FOUND_TRANSFER);
    }

    return transfer;
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER 정보를 삭제한다.
   *
   * @param {number} id - TRANSFER Id
   * @returns {Promise<void>}
   */
  deleteTransfer(id: number): void {
    this.transferRepository.delete(id);
  }
}
