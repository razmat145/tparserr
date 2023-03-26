
import ILogger from './ILogger';

interface IParserOpts {
    files?: Array<string>;

    useRelativePaths?: boolean;

    callerBaseDir?: string;

    targetDir?: string;

    includeOnlyDefaultExports?: boolean;

    includeOnlyRequiredProperties?: boolean;

    includeNestedClassNames?: boolean;

    logger?: ILogger
}

export default IParserOpts;