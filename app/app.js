"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const operations_manager = __importDefault(require("../modules/operations-manager"));
const user_stream = __importDefault(require("../modules/user-stream"));


class App {
    constructor() {
        this.isClosed = false;
        this.userStream = new user_stream.default();
        this.operationManager = new operations_manager.default();
    }
    start() {
        this.userStream.showInfo('\n[\x1b[35mattention\x1b[0m]', 'At the start of the program and after each end', 'of input/operation current working directory printed', 'in following way "path_to_working_directory>"');
        console.log(`> Welcome to the File Manager, ${this.userStream.userName}!`, '\n> Print commands and wait for results:\n');
        this.processData();
        this.handleAppExit();
    }

    processData() {
        process.stdout.write(`${this.operationManager.currentDirectory}\x1b[36m>\x1b[0m`);
        process.stdin.once('data', (data) => {
            this.operationManager.define(data).finally(() => {
                if (!this.isClosed)
                    this.processData();
            });
        });
    }
    handleAppExit() {
        process.on('SIGINT', () => {
            process.exit(0);
        });
        process.on('exit', () => {
            this.isClosed = true;
            console.log(`\nThank you for using File Manager, ${this.userStream.userName}!\n`);
        });
    }
}
exports.default = App;