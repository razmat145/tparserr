
export function DecoratorOne(message?: string): Function {
    return () => { return; };
}

export function DecoratorTwo(enabled?: boolean): Function {
    return () => { return; };
}

export function DecoratorThree(index?: number): Function {
    return () => { return; };
}

export function DecoratorFour(): Function {
    return () => { return; };
}

export function DecoratorFive(...args: Array<any>): Function {
    return () => { return; };
}

export function Required(): Function {
    return () => { return; };
}

export function Name(name?: string): Function {
    return () => { return; };
}

export function MaxLength(length?: number): Function {
    return () => { return; };
}

export function Optional(): Function {
    return () => { return; };
}

type someTuple = [string, string?] 

export function ArrayDeco(...args: Array<someTuple>): Function {
    return () => { return; };
}