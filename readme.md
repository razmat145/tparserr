# tparserr

Typescript Type Parser

## Motivation

Ability to extract basic dumbed down type descriptions for a target file/dir in order for said type description to be potentially used by later libraries for automating/generating various dev QoL utilities.
Very opinnionated in its intent, this library does not aspire for a be-all and end-all parser and will only include more complex type as and when needed - due to the fact that the majority of real-life type entities are fairly basic.

### Installing

<TBD>

### Usage

Given a target file
```typescript
// __dirname + ../targetFiles/Entity.ts
export default class Entiy {
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
// prettified console.log output
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
    }
]
```


## License
This library is licensed under the Apache 2.0 License
