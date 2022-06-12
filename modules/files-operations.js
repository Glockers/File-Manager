"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const operations = __importDefault(require("./operations"));
const brotli_comress = __importDefault(require("./brotli-comress"));

class FilesOperations extends operations.default {
    constructor() {
        super();
        this.brotliCompress = new brotli_comress.default();
    }
    async readFile(argv, hasInfo = true) {
        const pathToFile = (0, path.resolve)(this.directory, this.getFolderName(argv));
        return new Promise((res, rej) => {
            const readStream = (0, fs.createReadStream)(pathToFile, 'utf-8');
            let data = '';
            readStream.on('data', (chunk) => {
                data += chunk.toString('utf-8');
            });
            readStream.on('end', () => {
                if (hasInfo) {
                    this.userStream.showInfo('[\x1b[36minfo\x1b[0m]\n', data);
                }
                res(data);
            });
            readStream.on('error', (err) => {
                this.printError(pathToFile);
                rej(err);
            });
        });
    }
    async addFile(argv) {
        const pathToFile = (0, path.resolve)(this.directory, this.getFolderName(argv));
        return new Promise((res, rej) => {
            const writeStream = (0, fs.createWriteStream)(pathToFile, { encoding: 'utf8' });
            writeStream.on('close', () => {
                this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `An empty file was created in ${this.directory}`);
                res();
            });
            writeStream.on('error', () => {
                this.printError(pathToFile);
                rej();
            });
            writeStream.end('');
            writeStream.close();
        });
    }
    async renameFile(argv) {
        const userArgv = this.getArguments(argv);
        const pathToFile = (0, path.resolve)(this.directory, userArgv[0]);
        try {
            await (0, promises.rename)(pathToFile, (0, path.resolve)((0, path.dirname)(pathToFile), userArgv[1]));
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `A file was renamed in ${userArgv[1]}`);
        }
        catch (error) {
            this.printError(pathToFile);
        }
    }
    async copyFile(argv, isMove = false) {
        const userArgv = this.getArguments(argv);
        const pathToFile = (0, path.resolve)(this.directory, userArgv[0] || '');
        const newFilePath = (0, path.resolve)(this.directory, userArgv[1] || '');
        try {
            await (0, promises.copyFile)(pathToFile, newFilePath);
            if (isMove) {
                await this.removeFile([userArgv[0]]);
            }
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `${pathToFile} was ${!isMove ? 'copied' : 'moved'} to ${newFilePath}`);
        }
        catch (error) {
            this.printError(pathToFile);
        }
    }
    async removeFile(argv, hasPrint = false) {
        const pathToFile = (0, path.resolve)(this.directory, this.getFolderName(argv));
        try {
            await (0, promises.rm)(pathToFile);
            if (hasPrint) {
                this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `A file was removed from ${pathToFile}`);
            }
        }
        catch (error) {
            this.printError(pathToFile);
        }
    }
    async printHash(argv) {
        const pathToFile = (0, path.resolve)(this.directory, this.getFolderName(argv));
        try {
            const fileText = await this.readFile(argv, false);
            const hash = (0, crypto.createHmac)('sha256', 'secret')
                .update(fileText)
                .digest('hex');
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `Calculated hash for file: ${hash}`);
        }
        catch (error) {
            this.printError(pathToFile);
        }
    }
    async compress(argv) {
        const userArgv = this.getArguments(argv);
        const pathToFile = (0, path.resolve)(this.directory, userArgv[0] || '');
        const pathToDest = (0, path.resolve)(this.directory, userArgv[1] || '');
        return this.brotliCompress
            .compress(pathToFile, pathToDest)
            .then((path) => {
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `A file was compressed to ${path}`);
        })
            .catch(() => {
            this.printError(pathToFile);
        });
    }
    async decompress(argv) {
        const userArgv = this.getArguments(argv);
        const pathToFile = (0, path.resolve)(this.directory, userArgv[0] || '');
        const pathToDest = (0, path.resolve)(this.directory, userArgv[1] || '');
        try {
            const path = await this.brotliCompress.decompress(pathToFile, pathToDest);
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `A file was decompressed to ${path}`);
        }
        catch (error) {
            this.printError(pathToFile);
        }
    }
    printError(path) {
        this.userStream.showError('Operation failed:', `no such file or directory ${path}`);
    }
    getArguments(argv) {
        if (argv.length === 0) {
            argv.push('');
        }
        return argv.filter((str) => str.includes('"'))[0]
            ? argv
                .join(' ')
                .split('"')
                .filter((str) => Boolean(str))
            : argv;
    }
}
exports.default = FilesOperations;
//# sourceMappingURL=files-operations.js.map