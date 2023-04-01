
import ILogger from './ILogger';

interface IParserOpts {
    files?: Array<string>;

    useRelativePaths?: boolean;

    callerBaseDir?: string;

    targetDir?: string;

    includeOnlyExports?: boolean;

    includeOnlyRequiredProperties?: boolean;

    includeNestedClassNames?: boolean;

    enableDecorators?: boolean;

    logger?: ILogger
}

export default IParserOpts;