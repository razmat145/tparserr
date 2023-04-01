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
     * Note: usually this is the dir of the caller's context and can simply be passed as __dirname 
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

    /**
     * Logger to use instead of console if provided
     * 
     * Note: the logger will be usually used at debug and error log levels
     */
    logger?: ILogger // defaults to console
}
```


## License
This library is licensed under the Apache 2.0 License
