
export default class Entiy {
    names?: Array<string>;

    positions: Array<number>;

    flags?: Array<boolean>;

    points: Array<Point>;

    traces?: Array<Date>;
}

class Point {
    name?: string;

    value: number;

    createdAt?: CaptureTimestamp;

    modifiedAt?: Array<CaptureTimestamp>;
}

class CaptureTimestamp {
    value: Date;

    createdBy?: string;
}