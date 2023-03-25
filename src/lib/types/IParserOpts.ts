
interface IParserOpts {
    files?: Array<string>;

    useRelativePaths?: boolean;

    callerBaseDir?: string;

    targetDir?: string;

    includeOnlyDefaultExports?: boolean;
}

export default IParserOpts;