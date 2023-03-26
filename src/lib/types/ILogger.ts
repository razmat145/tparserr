
type TLoggerMethod = (message: string) => void;

interface ILogger {
    debug: TLoggerMethod;

    info: TLoggerMethod;

    warn: TLoggerMethod;

    error: TLoggerMethod
}

export default ILogger;