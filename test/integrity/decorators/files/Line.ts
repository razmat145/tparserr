
import { DecoratorOne, DecoratorTwo, DecoratorThree, DecoratorFour, DecoratorFive } from './MockDecorators';

@DecoratorFive('string', true, 101)
@DecoratorFour()
@DecoratorThree(101)
@DecoratorTwo(true)
@DecoratorOne('someMessage')
export class Line {

    @DecoratorOne('maximum of 101 characters')
    name?: string;

    @DecoratorTwo(true)
    x: number;

    @DecoratorThree(102)
    y: number;

    @DecoratorFour()
    createdAt?: Date;
}