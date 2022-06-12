"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserStream {
    constructor() {
        this.userName = 'userName';
        this.userName = this.getArgByName('username').value;
    }
    getArgByName(name) {
        return (this.getArgs().find((value) => value.name === name) || {
            name: 'username',
            value: 'username',
        });
    }
    showError(err = 'Invalid input', ...errText) {
        console.log(' [\x1b[31merror\x1b[0m]', err, ...errText);
    }
    showInfo(subtext, ...info) {
        console.log(subtext, ...info, '\n');
    }
    getArgs() {
        const userInputsArgs = process.argv.slice(2);
        return userInputsArgs.reduce((acc, arg) => {
            const argValue = arg.split('=');
            if (argValue[1] && arg.startsWith('--')) {
                acc.push({
                    name: argValue[0].slice(2),
                    value: argValue[1],
                });
            }
            return acc;
        }, []);
    }
}
exports.default = UserStream;