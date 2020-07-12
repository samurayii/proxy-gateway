#!/usr/bin/env node
import config from "./lib/entry";
import * as ProxyChain from "proxy-chain";
import { RouterClass } from "./lib/router-class";
import { LoggerClass } from "./lib/logger-class";

type TParams = {
    username: string
    password: string
    hostname: string
    port: number
    isHttp: boolean
    connectionId: number
    request: { 
        url: string; 
    }
    stats: unknown
    error?: Error
}

const logger = new LoggerClass(config.logger);
const router = new RouterClass(config.gateway.proxies);

const server = new ProxyChain.Server({
    port: config.gateway.port,
    prepareRequestFunction: ( params: TParams ) => {

        logger.log(`Request ${params.request.url}, connection: ${params.connectionId})`, "dev");

        let requestAuthentication = config.auth.enable;

        if (requestAuthentication === true) {

            for (const index in config.auth.users) {
                const record = config.auth.users[index];
                if (record.login === params.username && record.password === params.password) {
                    requestAuthentication = false;
                    break;
                }
            }

        }

        return {
            requestAuthentication: requestAuthentication,
            upstreamProxyUrl: router.getRoute(),
            failMsg: "Bad username or password, please try again."
        };
    },
});
 
server.listen(() => {
  logger.cyan(`Proxy gateway is listening on port ${config.gateway.port}`, "prod");
});

server.on("connectionClosed", ( params: TParams ) => {
    logger.log(`Connection ${params.connectionId} closed`, "dev");
    logger.log(params.stats, "debug");
});

server.on("requestFailed", ( params: TParams ) => {
    logger.error(`Request ${params.request.url} failed`, "prod");
    logger.error(params.error, "prod");
});