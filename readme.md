# tparserr

Typescript Type Parser

## Motivation

Ability to extract basic dumbed down type descriptions for a target file(s)/dir in order for said type descriptions to be potentially used by later libraries for automating/generating various dev QoL utilities.    
Very opinionated in its intent, this library does not aspire to become a be-all and end-all parser and will only include more complex types as and when needed - due to the fact that the majority of real-life type entities are fairly basic.

### Installing

```
npm install --save tparserr
```

### Usage

#### cli
###### within a project
```
npx tparserr generate -f=./src/lib/models/User.ts -o=./User.json
```
###### installed as global npm package
```
tparserr generate -d=./using-tparserr/src/lib/models -o=./types.json
```
###### options
```
Usage: tparserr generate [options]

Options:
      --version                        Show version number             [boolean]
  -f, --file                           File path to load and generate   [string]
  -d, --dir                            Dir path to load and generate    [string]
  -o, --output                         Output file path      [string] [required]
      --includeOnlyExports             If to include only exported types
                                                      [boolean] [default: false]
      --includeOnlyRequiredProperties  If to include only required properties
                                                      [boolean] [default: false]
      --includeNestedClassNames        If to include nested class names
                                                      [boolean] [default: false]
      --enableDecorators               If to enable decorators
                                                      [boolean] [default: false]
  -h, --help                           Show help                       [boolean]
```

#### Programatic

Given a target file
```typescript
// __dirname + ../targetFiles/Entity.ts
export class Entiy {
    id: number;

    names?: Array<string>;

    createdAt: CaptureTimestamp;

    enabled: boolean;
}

class CaptureTimestamp {
    value: Date;

    createdBy?: string;
}
```

Attempting to parse said file e.g.
```typescript
// index.ts
import { Parserr } from 'tparserr';

async function main() {
    const output = await Parserr.parse({
        files: ['../targetFiles/Entity.ts'],
        callerBaseDir: __dirname
    });

    console.log(JSON.stringify(output));
}

main().catch(console.error);
```

Would yield a result of
```json
[
    {
        "name": "Entiy",
        "type": "object",
        "properties": {
            "id": {
                "type": "number",
                "required": true
            },
            "names": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "required": false
            },
            "createdAt": {
                "type": "object",
                "properties": {
                    "value": {
                        "type": "Date",
                        "required": true
                    },
                    "createdBy": {
                        "type": "string",
                        "required": false
                    }
                },
                "required": true
            },
            "enabled": {
                "type": "boolean",
                "required": true
            }
        }
    },
    {
        "name": "CaptureTimestamp",
        "type": "object",
        "properties": {
            "value": {
                "type": "Date",
                "required": true
            },
            "createdBy": {
                "type": "string",
                "required": false
            }
        }
    }
]
```
#### Alternative pathing options
If the typescript files you are attempting to parse are within the current source-code, it might be handy to:   

###### Resolve the relative paths against the current `cwd` 

```typescript
// e.g. given a file of ./models/User.ts
const output = await Parserr.parse({
    files: [path.resolve('./src/lib/models/User.ts')]
});
```
###### Enable `enableSourceFilePathing` config to make use of https://github.com/razmat145/tspathrr in order to resolve the relative paths against the `tsconfig` opts   
This uses `rootDir` and `outDir` typescript compiler opts in order to properly resolve the file absolute path against the `__dirname` and `process.cwd()`
```typescript
// e.g. given a file of ./models/User.ts
const output = await Parserr.parse({
    files: ['./models/User.ts'],
    callerBaseDir: __dirname,
    enableSourceFilePathing: true
});
```

#### Decorators
The actual decorator implementations is not important, from `tparserr`'s POV decorators are extracted as annotations in `{ name, args }` pairs.   

Note: when `enableDecorators` is set, `tparserr` will use `experimentalDecorators` and `emitDecoratorMetadata` compiler options when creating the `ts.Program`

Given target file
```typescript
@Name('ABC User')
export class User {
    @Required()
    id: number;

    @Optional()
    phone?: Array<string>;

    @MaxLength(101)
    address: string;

    @Optional()
    active: boolean;
}

```
The output would then contain a description of the used decorators and their args
```json
[
    {
        "name": "User",
        "type": "object",
        "properties": {
            "id": {
                "type": "number",
                "required": true,
                "annotations": [
                    {
                        "name": "Required"
                    }
                ]
            },
            "phone": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "required": false,
                "annotations": [
                    {
                        "name": "Optional"
                    }
                ]
            },
            "address": {
                "type": "string",
                "required": true,
                "annotations": [
                    {
                        "name": "MaxLength",
                        "args": [
                            101
                        ]
                    }
                ]
            },
            "active": {
                "type": "boolean",
                "required": true,
                "annotations": [
                    {
                        "name": "Optional"
                    }
                ]
            }
        },
        "annotations": [
            {
                "name": "Name",
                "args": [
                    "ABC User"
                ]
            }
        ]
    }
]
```

### Configuration

```typescript
interface IParserOpts {
    /**
     * Input files to parse
     * Usually absolute paths unless *callerBaseDir* is provided (see below)
     */
    files?: Array<string>;

    // Declaring the intention to use relative paths
    useRelativePaths?: boolean; // defaults to false

    /**
     * Callers base dir - Must be provided when using relative path file(s)/targetDir 
     * or a mix of absolute and relative files
     * 
     * Note: see relative paths limitations
     */
    callerBaseDir?: string;

    // Input dir - to be used instead of *files*
    targetDir?: string;

    // If to parse only exports/default exports
    includeOnlyExports?: boolean; // defaults to false

    // If to include only required properties
    includeOnlyRequiredProperties?: boolean; // defaults to false

    // If to include the neste class names
    includeNestedClassNames?: boolean; // defaults to false
    
    // If to enable the extract of decorator descriptions
    enableDecorators?: boolean; // defaults to false
    
    // If to enable the use of tspathrr to resolve relative paths
    enableSourceFilePathing?: boolean // defaults to false
    
    /**
     * Logger to use instead of console if provided
     * 
     * Note: the logger will be usually used at debug and error log levels
     */
    logger?: ILogger // defaults to console
}
```

#### (Known) Limitations
- Relative Paths - Absolute paths work best, but when providing relative paths and a `calledBaseDir` as `__dirname`, one has to make sure he takes into account the relative path in relation to the execution context. When building a TS program, the execution of said program will actually take place within the `/dist` folder and thus `__dirname` will have the path of the e.g. `/dist/caller.js`
- Decorators - When decorator annotation extraction is enabled via `enableDecorators`, the base `tsconfig.json` might require `experimentalDecorators` and `emitDecoratorMetadata` compiler options to be enabled - they have to be enabled anyway in order to even decorate target classes.
- Export Defaults - Using `export default MyClass;` on a separate line than where it's defined will not work when `includeOnlyExports` is enabled - doing so makes the `ts.Node` loose it's `ExportDefault` modifier.

## License
This library is licensed under the Apache 2.0 License
