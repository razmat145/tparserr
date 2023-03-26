
interface IParserOpts {
    files?: Array<string>;

    useRelativePaths?: boolean;

    callerBaseDir?: string;

    targetDir?: string;

    includeOnlyDefaultExports?: boolean;

    includeOnlyRequiredProperties?: boolean;
}

export default IParserOpts;