
import * as ts from 'typescript';
import _ from 'lodash';

import IParserOpts from '../types/IParserOpts';


class Session {

    private program: ts.Program;

    private typeChecker: ts.TypeChecker;

    private opts: IParserOpts;

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

    public setConfigOpts(opts: IParserOpts) {
        this.opts = _.assign(this.getConfigDefaults(), opts);
    }

    public getConfigItem(configKey: keyof IParserOpts) {
        if (!_.isEmpty(this.opts)) {
            return this.opts[configKey];
        } else {
            throw new Error('Parserr Session ConfigOpts not initialised');
        }
    }

    public clear() {
        this.typeChecker = null;
        this.program = null;
        this.opts = this.getConfigDefaults();
    }

    private getConfigDefaults(): Partial<IParserOpts> {
        return {
            includeOnlyDefaultExports: true
        };
    }

}

export default new Session();