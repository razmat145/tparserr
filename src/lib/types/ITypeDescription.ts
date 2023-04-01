
export interface ITypeDescription {
    name?: string;

    type?: string;

    required?: boolean;

    items?: ITypeDescription;

    properties?: Record<string, ITypeDescription>;

    annotations?: Array<IAnnotation>;
}

export interface IAnnotation {
    name: string;

    args?: Array<any>;
}