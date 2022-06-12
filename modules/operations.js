"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const promises = require("fs/promises");
const user_stream = __importDefault(require("./user-stream"));
class Operations {
    constructor() {
        this.directory = (0, os.homedir)();
        console.log(this.directory)
        this.userStream = new user_stream.default();
    }
    up() {
        if (this.directory === (0, path.join)(this.directory, '..')) {
            this.userStream.showError("Operation failed: operation can't change working directory");
        }
        this.directory = (0, path.join)(this.directory, '..');
    }
    async cd(argv) {
        const newPath = (0, path.resolve)(this.directory, this.getFolderName(argv));
        try {
            const value = await (0, promises.stat)(newPath);
            if (value.isDirectory()) {
                this.directory = newPath;
            }
            else {
                throw new Error('no directory');
            }
        }
        catch (error) {
            this.userStream.showError('Operation failed:', `no such directory ${newPath}`);
        }
    }
    async ls() {
        try {
            const filesInFolder = await (0, promises.readdir)(this.directory);
            await Promise.allSettled(filesInFolder.map(async (filePath) => {
                const fileInfo = await (0, promises.stat)((0, path.join)(this.directory, filePath));
                console.log(` [\x1b[32m${fileInfo.isFile() ? 'file' : 'dir '}\x1b[0m]`, filePath, `${fileInfo.size}kb`, fileInfo.birthtime);
            }));
        }
        catch (error) {
            this.userStream.showError('Operation failed');
        }
    }
    getFolderName(argv) {
        return argv.length < 2
            ? argv[0] || ''
            : argv
                .join(' ')
                .split('')
                .filter((char) => char !== "'" && char !== '"')
                .join('');
    }
}
exports.default = Operations;
//# sourceMappingURL=operations.js.map