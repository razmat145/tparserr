
import { DecoratorOne, DecoratorTwo, DecoratorThree, DecoratorFour, DecoratorFive } from './MockDecorators';

@DecoratorFive('string', true, 101)
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