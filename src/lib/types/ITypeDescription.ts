
interface ITypeDescription {
    name?: string;

    type?: string;

    required?: boolean;

    items?: Record<string, ITypeDescription>;

    properties?: Record<string, ITypeDescription>;
}

export default ITypeDescription; 