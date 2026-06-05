"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZatcaQrPayload = generateZatcaQrPayload;
exports.decodeZatcaQr = decodeZatcaQr;
function encodeTlv(tag, value) {
    const valueBuffer = Buffer.from(value, 'utf8');
    const tagBuffer = Buffer.from([tag]);
    const lengthBuffer = Buffer.from([valueBuffer.length]);
    return Buffer.concat([tagBuffer, lengthBuffer, valueBuffer]);
}
function generateZatcaQrPayload(data) {
    const tlvTags = [
        { tag: 1, value: data.sellerName },
        { tag: 2, value: data.vatNumber },
        { tag: 3, value: data.timestamp },
        { tag: 4, value: data.invoiceTotal.toFixed(2) },
        { tag: 5, value: data.vatTotal.toFixed(2) },
    ];
    const buffers = tlvTags.map(({ tag, value }) => encodeTlv(tag, value));
    const combined = Buffer.concat(buffers);
    return combined.toString('base64');
}
function decodeZatcaQr(base64) {
    try {
        const buffer = Buffer.from(base64, 'base64');
        const result = {};
        let offset = 0;
        while (offset < buffer.length) {
            const tag = buffer[offset++];
            const length = buffer[offset++];
            const value = buffer.slice(offset, offset + length).toString('utf8');
            offset += length;
            switch (tag) {
                case 1:
                    result.sellerName = value;
                    break;
                case 2:
                    result.vatNumber = value;
                    break;
                case 3:
                    result.timestamp = value;
                    break;
                case 4:
                    result.invoiceTotal = parseFloat(value);
                    break;
                case 5:
                    result.vatTotal = parseFloat(value);
                    break;
            }
        }
        return result;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=qr-generator.js.map