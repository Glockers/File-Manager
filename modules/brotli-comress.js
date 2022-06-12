"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
class BrotliCompress {
    constructor() {
        this.brotliCompress = (0, zlib.createBrotliCompress)();
        this.brotliDecompress = (0, zlib.createBrotliDecompress)();
    }
    compress(pathToFile, pathToDest) {
        return new Promise((resolve, reject) => {
            const writeFilePath = (0, path.extname)(pathToDest)
                ? `${pathToDest}.br`
                : (0, path.join)(pathToDest, `${(0, path.basename)(pathToFile)}.br`);
            const readStream = (0, fs.createReadStream)(pathToFile);
            const writeStream = (0, fs.createWriteStream)(writeFilePath);
            const stream = readStream.pipe(this.brotliCompress).pipe(writeStream);
            readStream.on('error', (err) => {
                reject(err);
            });
            stream.on('finish', () => {
                resolve(writeFilePath);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    decompress(pathToFile, pathToDest) {
        return new Promise((resolve, reject) => {
            const pathToFileChecked = pathToFile.includes('.br')
                ? pathToFile
                : `${pathToFile}.br`;
            const fileOldName = (0, path.basename)(pathToFileChecked);
            const writeFilePath = (0, path.extname)(pathToDest)
                ? pathToDest
                : (0, path.join)(pathToDest, `${fileOldName.slice(0, fileOldName.length - 3)}`);
            console.log(pathToFileChecked, writeFilePath);
            const readStream = (0, fs.createReadStream)(pathToFileChecked);
            const writeStream = (0, fs.createWriteStream)(writeFilePath);
            const stream = readStream.pipe(this.brotliDecompress).pipe(writeStream);
            this.brotliDecompress.on('error', (err) => {
                reject(err);
            });
            stream.on('finish', () => {
                resolve(writeFilePath);
            });
            readStream.on('error', (err) => {
                reject(err);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}
exports.default = BrotliCompress;