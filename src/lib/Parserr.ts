
import _ from 'lodash';
import * as ts from 'typescript';

import Extractor from './Extractor';

import Session from './utils/Session';

import ITypeDescription from './types/ITypeDescription';


class Parserr {

    public async parse(files: string[]): Promise<Array<ITypeDescription>> {
        // TODO: async for moving to folder and improving various cfg input
        await this.initialise(files);

        this.trapDiagnostics();

        return Extractor.getSchemaDescription();
    }

    private async initialise(files: string[]) {
        const program = ts.createProgram(
            [...files],
            {
                target: ts.ScriptTarget.ES2016,
                module: ts.ModuleKind.CommonJS
            }
        );

        Session.setProgram(program);
    }

    private trapDiagnostics() {
        let diagnostics = ts.getPreEmitDiagnostics(Session.getProgram());

        for (const diagnostic of diagnostics) {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

            console.error(message); // TODO: use input cfg logger if provided
        }
    }

}

export default new Parserr();