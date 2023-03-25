
import * as ts from 'typescript';

import IParserOpts from '../types/IParserOpts';


class Session {

    private typeChecker: ts.TypeChecker;

    private program: ts.Program;

    private opts: IParserOpts = {
        includeOnlyDefaultExports: true
    }; // TODO: configurable input

    public setProgram(program: ts.Program) {
        this.program = program;
        this.typeChecker = program.getTypeChecker();
    }

    public getProgram(): ts.Program {
        if (this.program) {
            return this.program;
        } else {
            throw new Error('Parserr Session Program not initialised');
        }
    }

    public getTypeChecker(): ts.TypeChecker {
        if (this.typeChecker) {
            return this.typeChecker;
        } else {
            throw new Error('Parserr Session TypeChecker not initialised');
        }
    }

    public getConfigItem(configKey: keyof IParserOpts) {
        return this.opts[configKey];
    }

}

export default new Session();