// import { Payment } from '../../payments/models/payment';
export class User {
  id?: string;

  email: string;

  password: string;

  username: string;

  isSubscribed?: boolean;

  providerId?: string;

  photo?: string;

  paymentId?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  // @Field(() => [Payment], { nullable: true })
  // payments?: Payment[];
}
