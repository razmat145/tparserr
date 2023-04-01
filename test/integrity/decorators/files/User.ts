
import { Required, Optional, Name, MaxLength } from './MockDecorators';

@Name('ABC User')
export class User {
    @Required()
    id: number;

    @Optional()
    phone?: Array<string>;

    @MaxLength(101)
    address: string;

    @Optional()
    active: boolean;
}
