import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isEduEmail } from '../users/helpers';
import { getMakes, getModels } from 'car-info';

const makes = getMakes();

export function IsStudent(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isStudent',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['isStudent'],
      options: validationOptions,
      validator: {
        validate(value) {
          return typeof value === 'string' && isEduEmail(value);
        },
        defaultMessage() {
          return 'you must use a .edu email';
        }
      },
    });
  };
}

export function IsMake(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      name: 'isMake',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['isMake'],
      options: validationOptions,
      validator: {
        validate(value) {
          // @ts-expect-error I need to make car-info types better
          return typeof value === 'string' && makes.includes(value);
        },
        defaultMessage() {
          return 'you must use a .edu email';
        }
      },
    });
  };
}

export function IsModelFor(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isModelFor',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          const models: string[] = getModels(relatedValue);
          return typeof value === 'string' && models.includes(value);
        },
      },
    });
  };
}