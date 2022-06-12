"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const files_operations = __importDefault(require("./files-operations"));
class SystemOperations extends files_operations.default {
    constructor() {
        super();
    }
    async os(argv) {
        if (argv.length === 0) {
            this.userStream.showError('Operation failed');
        }
        argv.forEach((arg) => {
            const argName = arg.startsWith('--') ? arg.slice(2) : null;
            switch (argName) {
                case 'EOL':
                    this.printEOL();
                    break;
                case 'cpus':
                    this.printCPUSInfo();
                    break;
                case 'homedir':
                    this.printHomeDir();
                    break;
                case 'username':
                    this.printUserName();
                    break;
                case 'architecture':
                    this.printCPUArchitecture();
                    break;
                default:
                    this.userStream.showError('Operation failed');
                    break;
            }
        });
    }
    printEOL() {
        this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `Default system End-Of-Line is ${JSON.stringify(os.EOL)}`);
    }
    printCPUSInfo() {
        this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `Amount of CPUS: ${(0, os.cpus)().length}`);
        (0, os.cpus)().forEach((cpu) => {
            this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `Model: ${cpu.model}; Clock rate: ${cpu.speed}GHz`);
        });
    }
    printHomeDir() {
        this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `Home directory: ${(0, os.homedir)()}`);
    }
    printUserName() {
        this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `System user name: ${(0, os.userInfo)().username}`);
    }
    printCPUArchitecture() {
        this.userStream.showInfo('[\x1b[36minfo\x1b[0m]', `CPU architecture: ${(0, os.arch)()}`);
    }
}
exports.default = SystemOperations;
//# sourceMappingURL=system-operations.js.map