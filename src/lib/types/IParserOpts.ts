
interface IParserOpts {
    useRelativePaths?: boolean;

    files?: Array<string>;

    targetDir?: string;

    includeOnlyDefaultExports?: boolean;
}

export default IParserOpts;