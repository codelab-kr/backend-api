import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { IdType } from '../database/enum/idType';

export function IdValueLength(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IdValueLength',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (relatedValue === IdType.REG_NO) {
            return value.length === 13;
          } else if (relatedValue === IdType.BUSINESS_NO) {
            return value.length === 10;
          } else {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const idType = (args.object as any).idType;
          return `${args.property} length is not valid for the given idType: ${idType}`;
        },
      },
    });
  };
}
