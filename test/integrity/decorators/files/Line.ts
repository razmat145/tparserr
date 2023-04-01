
import { DecoratorOne, DecoratorTwo, DecoratorThree, DecoratorFour } from './MockDecorators';

@DecoratorFour()
@DecoratorThree(101)
@DecoratorTwo(true)
@DecoratorOne('someMessage')
export class Line {
    name?: string;

    x: number;

    y: number;

    createdAt?: Date;
}