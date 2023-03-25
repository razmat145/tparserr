
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
        const targetDir = this.getTargetDir();
        const files = await afs.readdir(targetDir);

        const filePaths = _.map(files, file => path.join(targetDir, file));

        return this.normalizeFilePaths(filePaths);
    }

    private normalizeFilePaths(filePaths: Array<string>) {
        return _.map(filePaths, filePath => path.normalize(filePath));
    }

    private getTargetDir() {
        const targetDir = Session.getConfigItem('targetDir');

        if (Session.getConfigItem('useRelativePaths')) {
            return path.join(Session.getConfigItem('callerBaseDir'), targetDir);
        } else {
            return targetDir;
        }
    }

}

export default new File();