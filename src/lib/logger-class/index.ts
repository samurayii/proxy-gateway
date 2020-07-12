import * as chalk from "chalk";
import { EventEmitter } from "events";
import { ILoggerClass } from "./interfaces/logger-class";
import { ILoggerConfig } from "./interfaces/logger-config";

export class LoggerClass extends EventEmitter implements ILoggerClass {

    private _mode: string;
    private _enable: boolean;
    private _modes: string[];

    constructor ( config: ILoggerConfig ) {

        super();

        this._mode = "prod";
        this._enable = true;
        this._modes = [
            "prod",
            "dev",
            "debug"
        ];

        if (config.mode !== undefined) {

            if (!this._modes.includes(config.mode)) {
                throw Error(`Mode must be ${this._modes.join()}`);
            }

            this._mode = config.mode;
        }

        if (config.enable !== undefined) {

            if (typeof config.enable !== "boolean") {
                throw Error("Enable must be boolean");
            }

            this._enable = config.enable;
        }

    }

    _checkMode (mode: string): boolean {
        if (mode === "prod") {
            return true;
        }
        if (mode === this._mode) {
            return true;
        }
        if (this._mode === "debug" && mode === "dev") {
            return true;
        }
        return false;
    }

    _log (message: unknown, mode: string): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.log(message);
        }
    }

    _info(message: unknown, mode: string): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.cyan(message));
        }
    }

    _error(message: unknown, mode: string): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.error(chalk.red(message));
        }
    }

    _warning(message: unknown, mode: string): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.yellow(message));
        }
    }

    log (message: unknown, mode: string = "prod"): void {
        this._log(message, mode);
        this.emit("message", message, "log", mode);
    }

    info (message: unknown, mode: string = "prod"): void {
        message = `[INFO] ${message}`;
        this._info(message, mode);
        this.emit("message", message, "info", mode);
    }

    error (message: unknown, mode: string = "prod"): void {
        message = `[ERROR] ${message}`;
        this._error(message, mode);
        this.emit("message", message, "error", mode);
    }

    warn (message: unknown, mode: string = "prod"): void {
        message = `[WARNING] ${message}`;
        this._warning(message, mode);
        this.emit("message", message, "warning", mode);
    }

    red (message: unknown, mode: string = "prod"): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.red(message));
        }
        this.emit("message", message, "log", mode);
    }

    yellow (message: unknown, mode: string = "prod"): void {
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.yellow(message));
        }
        this.emit("message", message, "log", mode);
    }

    cyan (message: unknown, mode: string = "prod"): void {      
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.cyan(message));
        }
        this.emit("message", message, "log", mode);
    }

    green (message: unknown, mode: string = "prod"): void {      
        if (this._checkMode(mode) && this._enable === true) {
            console.log(chalk.green(message));
        }
        this.emit("message", message, "log", mode);
    }

    enable (): void {
        if (this._enable === false) {
            this._enable = true;
            console.log("logger activated");
        }
    }

    disable (): void {
        if (this._enable === true) {
            this._enable = false;
            console.log("logger deactivated");
        }
    }

    setMode (mode: string): void {
        if (this._modes.includes(mode)) {
            this._mode = mode;
        }
    }
}