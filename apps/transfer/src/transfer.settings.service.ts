import { Injectable } from '@nestjs/common';
import { TransferettingsRepository } from './repositories/transfer.settings.repository';
import { Transferettings } from './models/transfer.settings';
import { CreateTransferettingsInput } from './utils/create.transfer.settings.input';
import { TransferRepository } from './repositories/transfer.repository';

@Injectable()
export class TransferettingsService {
  constructor(
    private readonly transferRepository: TransferRepository,
    private readonly transferettingsRepository: TransferettingsRepository,
  ) {}

  /**
   * TRANSFER Settings를 생성한다.
   *
   * @param {CreateTransferettingsInput} requestDto - TRANSFER Settings를 생성 Dto
   * @returns {Promise<Transferettings>}
   */
  async createTransferettings(
    requestDto: CreateTransferettingsInput,
  ): Promise<Transferettings> {
    const findTransfer = await this.transferRepository.findOneBy({
      id: requestDto.transferId,
    });
    if (!findTransfer) throw new Error('Transfer not found');
    const newSettings = this.transferettingsRepository.create(requestDto);
    const savedSettings =
      await this.transferettingsRepository.save(newSettings);
    findTransfer.settings = savedSettings;
    await this.transferRepository.save(findTransfer);
    return savedSettings;
  }

  /**
   * TRANSFER Id에 해당하는 TRANSFER Settings 정보를 반환한다.
   *
   * @param {number} transferId - TRANSFER Id
   * @returns {Promise<Transferettings>}
   */
  findByTransferId(transferId: number): Promise<Transferettings> {
    return this.transferettingsRepository.findOneBy({ transferId });
  }
}
