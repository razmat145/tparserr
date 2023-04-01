
export class Line {
    name?: string;

    x: Point;

    y: Point;

    createdAt?: CaptureTimestamp;
}

class Point {
    name?: string;

    value: number;

    createdAt?: CaptureTimestamp;
}

class CaptureTimestamp {
    value: Date;

    createdBy?: string;
}
