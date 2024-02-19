import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from '../src/transfer.controller';
import { TransferService } from '../src/transfer.service';
import { transferStub } from './stubs/transfer.stub';
import { Transfer } from '../src/models/transfer';
import { CreateTransferInput } from '../src/utils/create.transfer.input';

jest.mock('../src/transfer.service');

describe('TransferController', () => {
  let transferController: TransferController;
  let transferService: TransferService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [TransferService],
    }).compile();

    transferController = app.get<TransferController>(TransferController);
    transferService = app.get<TransferService>(TransferService);
    jest.clearAllMocks();
  });

  describe('findOneBy', () => {
    describe('when findOneBy is called', () => {
      let transfer: Transfer;

      beforeEach(async () => {
        transfer = await transferController.findOne(transferStub().id);
      });

      test('then it should call transferService', () => {
        expect(transferService.findById).toHaveBeenCalledWith(
          transferStub().id,
        );
      });

      test('then it should return a transfer', () => {
        expect(transfer).toEqual(transferStub());
      });
    });

    describe('findAll', () => {
      describe('when getTransfer is called ', () => {
        let transfer: Transfer[];

        beforeEach(async () => {
          transfer = await transferController.findAll();
        });

        test('then it should call transferService', () => {
          expect(transferService.findAll).toHaveBeenCalled();
        });

        test('then it should return transfer', () => {
          expect(transfer).toEqual([transferStub()]);
        });
      });
    });

    describe('create', () => {
      describe('when create is called', () => {
        let transfer: Transfer;
        let request: CreateTransferInput;

        beforeEach(async () => {
          request = {
            title: transferStub().title,
            content: transferStub().content,
            userId: transferStub().userId,
          };
          transfer = await transferController.create(request);
        });

        test('then it should call transferService', async () => {
          expect(transferService.createTransfer).toHaveBeenCalledWith(request);
        });

        test('then it should return a transfer', () => {
          expect(transfer).toEqual(transferStub());
        });
      });
    });
  });
});
