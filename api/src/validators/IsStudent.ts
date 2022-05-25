import { registerDecorator, ValidationOptions } from 'class-validator';
import { isEduEmail } from '../account/helpers';

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
