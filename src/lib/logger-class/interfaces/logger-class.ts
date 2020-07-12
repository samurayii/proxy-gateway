import { EventEmitter } from "events";

export interface ILoggerClass extends EventEmitter {
    log: (message: unknown, mode: string) => void
    info: (message: unknown, mode: string) => void
    error: (message: unknown, mode: string) => void
    warn: (message: unknown, mode: string) => void
    red: (message: unknown, mode: string) => void
    yellow: (message: unknown, mode: string) => void
    green: (message: unknown, mode: string) => void
    cyan: (message: unknown, mode: string) => void
    enable: () => void
    disable: () => void
    setMode: (mode: string) => void
}