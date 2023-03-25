
import * as ts from 'typescript';
import _ from 'lodash';

import Extractor from './Extractor';

import Session from './utils/Session';

import ITypeDescription from './types/ITypeDescription';
import IParserOpts from './types/IParserOpts';


class Parserr {

    private filesToExtract: Array<string> = [];

    public async parse(opts: IParserOpts): Promise<Array<ITypeDescription>> {
        await this.initialise(opts);

        this.trapDiagnostics();

        const schemaDescription = Extractor.getSchemaDescription();

        this.cleanUp();

        return schemaDescription;
    }

    private async initialise(opts: IParserOpts) {
        Session.setConfigOpts(opts);

        await this.loadFilePaths(opts);

        this.createProgram();
    }

    private async loadFilePaths(opts: IParserOpts) {
        const { files } = opts;

        if (!_.isEmpty(files)) {
            this.filesToExtract = files;
        } else {
            throw new Error('*files* IParserOpts is currently mandatory');
        }
    }

    private createProgram() {
        const program = ts.createProgram(
            this.filesToExtract,
            {
                target: ts.ScriptTarget.ES2016,
                module: ts.ModuleKind.CommonJS
            }
        );

        Session.setProgram(program);
    }

    private cleanUp() {
        this.filesToExtract = [];
    }

    private trapDiagnostics() {
        const diagnostics = ts.getPreEmitDiagnostics(Session.getProgram());

        for (const diagnostic of diagnostics) {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            console.error(message); // TODO: use input cfg logger if provided
        }
    }

}

export default new Parserr();