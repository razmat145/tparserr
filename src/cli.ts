#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import _ from 'lodash';
import { promises as afs } from 'fs';

import path from 'path';

import { Parserr } from './index';

const filePathOpts: yargs.Options = {
    alias: 'file',
    describe: 'File path to load and generate',
    type: 'string'
};

const dirPathOpts: yargs.Options = {
    alias: 'dir',
    describe: 'Dir path to load and generate',
    type: 'string'
};

const outputPathOpts: yargs.Options = {
    alias: 'output',
    describe: 'Output file path',
    demand: true,
    type: 'string'
};

const includeOnlyExportsOpts: yargs.Options = {
    describe: 'If to include only exported types',
    demand: false,
    type: 'boolean',
    default: false
};

const includeOnlyRequiredPropertiesOpts: yargs.Options = {
    describe: 'If to include only required properties',
    demand: false,
    type: 'boolean',
    default: false
};

const includeNestedClassNamesOpts: yargs.Options = {
    describe: 'If to include nested class names',
    demand: false,
    type: 'boolean',
    default: false
};

const enableDecoratorsOpts: yargs.Options = {
    describe: 'If to enable decorators',
    demand: false,
    type: 'boolean',
    default: false
};

const mutuallyExcludeFileAndDir = (argv) => {
    const { file, dir } = argv;

    switch (true) {
        case !!file && !!dir:
        case !file && !dir:
            throw new Error(`Either *file* or *dir* options have to be passed`);

        default:
            return true;
    }
};

const runner = async (args) => {

    const { file, dir, output } = args;
    const opts = _.pick(args, [
        'includeOnlyExports',
        'includeOnlyRequiredProperties',
        'includeNestedClassNames',
        'enableDecorators'
    ]);

    if (file) {
        _.assign(opts, { files: [file] });
    } else {
        _.assign(opts, { targetDir: dir });
    }

    const typeDescription = await Parserr.parse(_.assign(opts, {
        callerBaseDir: process.cwd()
    }));

    const outputFilePath = path.isAbsolute(output) ? output : path.resolve(process.cwd(), output);
    await afs.writeFile(output, JSON.stringify(typeDescription));
};

export function run() {
    return yargs(hideBin(process.argv))
        .usage('Usage: tparserr generate [options]')
        .command('generate', 'Generate Type Descriptions', {}, runner)
        .option('f', filePathOpts)
        .option('d', dirPathOpts)
        .option('o', outputPathOpts)
        .option('includeOnlyExports', includeOnlyExportsOpts)
        .option('includeOnlyRequiredProperties', includeOnlyRequiredPropertiesOpts)
        .option('includeNestedClassNames', includeNestedClassNamesOpts)
        .option('enableDecorators', enableDecoratorsOpts)
        .check(mutuallyExcludeFileAndDir)
        .demand(2, 'Both a target and an output option have to be passed')
        .help('help')
        .alias('help', 'h')
        .parse();
}

if (require.main === module) {
    (async () => {
        try {
            await run();
        } catch (err) {
            console.error('Error while attempting to generate:\n', err);
            process.exit(1);
        }
    })();
}