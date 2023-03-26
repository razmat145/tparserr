
interface ITypeDescription {
    name?: string;

    type?: string;

    required?: boolean;

    items?: ITypeDescription;

    properties?: Record<string, ITypeDescription>;
}

export default ITypeDescription; 