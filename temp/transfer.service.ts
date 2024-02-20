import { Injectable } from '@nestjs/common';
import { TransferRepository } from '../apps/transfer/src/repositories/transfer.repository';
import { Transfer } from '../apps/transfer/src/models/transfer';
import { CreateTransferInput } from '../apps/transfer/src/utils/create.transfer.input';
// import { CreateTransferInput } from './utils/create.quota.input';

@Injectable()
export class TransferService {
  constructor(private readonly transferRepository: TransferRepository) {}

  /**
   * TRANSFER Transfer를 생성한다.
   *
   * @param {CreateTransferInput} requestDto - TRANSFER Transfer를 생성 Dto
   * @returns {Promise<Transfer>}
   */

  // 송금요청 생성 (한도 체크 포함하기)
  // 유저는 미국과 일본으로 송금을 할 수 있어요.
  // 개인 유저의 1일 한도는 $1000 (1천 달러)
  // 법인 유저의 1일 한도는 $5000 (5천 달러)
  async createTransfer(requestDto: CreateTransferInput): Promise<Transfer> {
    const findQuote = await this.transferRepository.findOneBy({
      id: requestDto.transferId,
    });
    if (!findTransfer) throw new Error('Transfer not found');
    const newTransfer = this.transferRepository.create(requestDto);
    const savedTransfer = await this.transferRepository.save(newTransfer);
    findTransfer.quote = savedTransfer;
    await this.transferRepository.save(findTransfer);
    return savedTransfer;
  }

  // 한도체크

  /**
   * TRANSFER Id에 해당하는 TRANSFER Transfer 정보를 반환한다.
   *
   * @param {number} transferId - TRANSFER Id
   * @returns {Promise<Transfer>}
   */
  findByTransferId(transferId: number): Promise<Transfer> {
    return this.transferRepository.findOneBy({ transferId });
  }
}
