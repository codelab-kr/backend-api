import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TransferService } from '../quote.service--';
import { TransferRepository } from '../../apps/transfer/src/repositories/transfer.repository';
import { Transfer } from '../../apps/transfer/src/models/quote';
import { transferStub } from './stubs/transfer.stub';
import { CreateTransferInput } from '../../apps/transfer/src/utils/create.transfer.input';
import { UpdateTransferInput } from '../../apps/transfer/src/utils/update.transfer.ipnput';

describe('TransferService (Stub)', () => {
  let transferService: TransferService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [TransferService, TransferRepository],
    }).compile();

    transferService = moduleRef.get<TransferService>(TransferService);

    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(transferService).toBeDefined();
  });

  describe('createTransfer', () => {
    describe('when createTransfer is called', () => {
      let transfer: Transfer;
      let saveSpy: jest.SpyInstance;

      const request = new CreateTransferInput();
      request.title = transferStub().title;
      request.content = transferStub().content;
      request.userId = transferStub().userId;

      beforeEach(async () => {
        saveSpy = jest
          .spyOn(TransferRepository.prototype, 'save')
          .mockResolvedValue(transferStub());
        transfer = await transferService.createTransfer(request);
      });

      test('then it should call transferRepository', async () => {
        expect(saveSpy).toHaveBeenCalledWith(request);
      });

      test('then it should return a transfer', () => {
        expect(transfer).toEqual(transferStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let transfer: Transfer[];
      let findSpy: jest.SpyInstance;

      beforeEach(async () => {
        findSpy = jest
          .spyOn(TransferRepository.prototype, 'find')
          .mockResolvedValue([transferStub()]);
        transfer = await transferService.findAll();
      });

      test('then it should call transferRepository', async () => {
        expect(findSpy).toHaveBeenCalled();
      });

      test('then it should return transfer', () => {
        expect(transfer).toStrictEqual([transferStub()]);
      });
    });
  });

  describe('findById', () => {
    describe('생성되지 않은 TRANSFER의 id가 주어진다면 TRANSFER를 찾을 수 없다는 예외를 던진다', () => {
      let findSpy: jest.SpyInstance;
      const id = 1;

      beforeEach(async () => {
        findSpy = jest
          .spyOn(TransferRepository.prototype, 'findOne')
          .mockResolvedValue(undefined);
      });

      test('then it should return NotFoundException', async () => {
        await expect(transferService.findById(id)).rejects.toThrow(
          NotFoundException,
        );
      });

      test('then it should call transferRepository', async () => {
        try {
          await transferService.findById(id);
        } catch (error) {
          expect(findSpy).toHaveBeenCalledWith({
            where: { id },
            relations: ['settings'],
          });
        }
      });
    });

    describe('생성된 TRANSFER의 id가 주어진다면 해당 id의 TRANSFER를 반환한다', () => {
      let transfer: Transfer;
      let findSpy: jest.SpyInstance;
      const id = 1;

      beforeEach(async () => {
        findSpy = jest
          .spyOn(TransferRepository.prototype, 'findOne')
          .mockResolvedValue(transferStub());
        transfer = await transferService.findById(id);
      });

      test('then it should call transferRepository', async () => {
        expect(findSpy).toHaveBeenCalledWith({
          where: { id },
          relations: ['settings'],
        });
      });

      test('then it should return a transfer', async () => {
        expect(transfer).toEqual(transferStub());
      });
    });
  });

  describe('updateTransfer', () => {
    describe('생성되지 않은 TRANSFER의 id가 주어진다면 TRANSFER를 찾을 수 없다는 예외를 던진다', () => {
      let findSpy: jest.SpyInstance;
      const requestDto: UpdateTransferInput = {
        id: 11,
        userId: 1,
      };

      beforeEach(async () => {
        findSpy = jest
          .spyOn(TransferRepository.prototype, 'findOne')
          .mockResolvedValue(undefined);
      });

      test('then it should return NotFoundException', async () => {
        await expect(
          transferService.updateTransfer(requestDto),
        ).rejects.toThrow(NotFoundException);
      });

      test('then it should call transferRepository', async () => {
        try {
          await transferService.findById(requestDto.id);
        } catch (error) {
          expect(findSpy).toHaveBeenCalledWith({
            where: { id: requestDto.id },
            relations: ['settings'],
          });
        }
      });
    });

    describe('생성된 TRANSFER의 id가 주어진다면 해당 id의 TRANSFER를 수정하고 수정된 TRANSFER를 반환한다', () => {
      let transfer: Transfer;
      let findSpy: jest.SpyInstance;
      let saveSpy: jest.SpyInstance;
      const request: UpdateTransferInput = {
        id: 1,
        userId: 1,
      };

      beforeEach(async () => {
        findSpy = jest
          .spyOn(TransferRepository.prototype, 'findOne')
          .mockResolvedValue(transferStub());
        saveSpy = jest
          .spyOn(TransferRepository.prototype, 'save')
          .mockResolvedValue(transferStub());
        transfer = await transferService.updateTransfer(request);
      });

      test('then it should call transferRepository', async () => {
        expect(findSpy).toHaveBeenCalledWith({
          where: { id: request.id },
          relations: ['settings'],
        });
        expect(saveSpy).toHaveBeenCalledWith({
          ...transferStub(),
          ...request,
        });
      });

      test('then it should return a transfer', async () => {
        expect(transfer).toEqual(transferStub());
      });
    });
  });

  describe('deleteTransfer', () => {
    describe('생성된 TRANSFER의 id가 주어진다면 생성된 TRANSFER를 삭제한다', () => {
      const id = 1;
      let deleteSpy: jest.SpyInstance;
      let result: void;

      beforeEach(async () => {
        deleteSpy = jest
          .spyOn(TransferRepository.prototype, 'delete')
          .mockResolvedValue({} as DeleteResult);
        result = transferService.deleteTransfer(id);
      });

      test('then it should call transferRepository', async () => {
        expect(deleteSpy).toHaveBeenCalledWith(id);
      });

      test('then it should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
