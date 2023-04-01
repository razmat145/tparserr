
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