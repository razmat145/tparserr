
import { DecoratorOne, DecoratorTwo, DecoratorThree, DecoratorFour, DecoratorFive, ArrayDeco } from './MockDecorators';

@DecoratorFive('string', true, 101)
@DecoratorFour()
@DecoratorThree(101)
@DecoratorTwo(true)
@DecoratorOne('someMessage')
@ArrayDeco(
    ['propOne'],
    ['propTwo', 'attribute']
)
export class Line {

    @DecoratorOne(`maximum of 101 characters`)
    name?: string;

    @DecoratorTwo(true)
    x: number;

    @DecoratorThree(102)
    y: number;

    @DecoratorFour()
    createdAt?: Date;

    someArray: Array<string>;

    @DecoratorOne('Line Audit Trail')
    audit?: Audit;
}

class Audit {
    @DecoratorFour()
    why: string;

    @DecoratorTwo(false)
    how: string;
}