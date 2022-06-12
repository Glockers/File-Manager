"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_operations = __importDefault(require("./system-operations"));
const user_stream = __importDefault(require("./user-stream"));
class OperationsManager {
    constructor() {
        this.oparations = new system_operations.default();
        this.userStream = new user_stream.default();
    }
    get currentDirectory() {
        return this.oparations.directory;
    }
    async define(data) {
        const inputData = data.toString('utf-8').trim().split(' ');
        const event = inputData[0];
        const argv = inputData.slice(1) || [''];
        if (event === '.exit') {
            process.exit(0);
        }
        try {
            switch (event) {
                case 'up':
                    await this.oparations.up();
                    break;
                case 'cd':
                    await this.oparations.cd(argv);
                    break;
                case 'ls':
                    await this.oparations.ls();
                    break;
                case 'os':
                    await this.oparations.os(argv);
                    break;
                case 'cat':
                    await this.oparations.readFile(argv);
                    break;
                case 'add':
                    await this.oparations.addFile(argv);
                    break;
                case 'rn':
                    await this.oparations.renameFile(argv);
                    break;
                case 'cp':
                    await this.oparations.copyFile(argv);
                    break;
                case 'mv':
                    await this.oparations.copyFile(argv, true);
                    break;
                case 'rm':
                    await this.oparations.removeFile(argv, true);
                    break;
                case 'hash':
                    await this.oparations.printHash(argv);
                    break;
                case 'compress':
                    await this.oparations.compress(argv);
                    break;
                case 'decompress':
                    await this.oparations.decompress(argv);
                    break;
                default:
                    this.userStream.showError();
                    break;
            }
        }
        catch (error) {
            //* *//
        }
    }
}
exports.default = OperationsManager;
//# sourceMappingURL=operations-manager.js.map