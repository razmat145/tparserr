
import * as ts from 'typescript';
import _ from 'lodash';

import Extractor from './Extractor';

import Session from './utils/Session';
import File from './utils/File';

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

        await this.loadFilePaths();

        this.createProgram();
    }

    private async loadFilePaths() {
        File.trapInvalidConfigOpts();

        if (!_.isEmpty(Session.getConfigItem('files'))) {
            this.filesToExtract = File.getNormalizedFilePaths();
        } else {
            this.filesToExtract = await File.extractNormalizedFilePaths();
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
        Extractor.clean();
        Session.clear();
    }

    private trapDiagnostics() {
        const diagnostics = ts.getPreEmitDiagnostics(Session.getProgram());

        if (!_.isEmpty(diagnostics)) {
            for (const diagnostic of diagnostics) {
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

                Session.getLogger().error(message);
            }

            throw new Error('Typescript Program failed to compile with the provided files');
        }
    }

}

export default new Parserr();