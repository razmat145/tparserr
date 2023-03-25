
import _ from 'lodash';

import path from 'path';
import { promises as afs } from 'fs';

import Session from './Session';


class File {

    public getNormalizedFilePaths(): Array<string> {
        const files = Session.getConfigItem('files');

        if (Session.getConfigItem('useRelativePaths')) {
            const aboluteFilePaths = _.map(files, file => path.join(Session.getConfigItem('callerBaseDir'), file));

            return this.normalizeFilePaths(aboluteFilePaths);
        } else {
            return this.normalizeFilePaths(files);
        }
    }

    public async extractNormalizedFilePaths(): Promise<Array<string>> {
        const files = await afs.readdir(Session.getConfigItem('callerBaseDir'));

        return this.normalizeFilePaths(files);
    }

    private normalizeFilePaths(filePaths: Array<string>) {
        return _.map(filePaths, filePath => path.normalize(filePath));
    }

}

export default new File();