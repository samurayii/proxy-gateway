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
    stats: {
        srcTxBytes: number
        srcRxBytes: number
        trgTxBytes: number
        trgRxBytes: number
    }
    error?: Error
}

const logger = new LoggerClass(config.logger);
const router = new RouterClass(config.gateway.proxies);

const server = new ProxyChain.Server({
    port: config.gateway.port,
    prepareRequestFunction: ( params: TParams ) => {

        let requestAuthentication = config.auth.enable;
        const road = router.getRoute();

        logger.log(`Request ${params.request.url} -> ${road.replace(/\:\/\/.*@/, "://")} (connection: ${params.connectionId})`, "dev");

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
            upstreamProxyUrl: road,
            failMsg: "Bad username or password, please try again."
        };
    },
});
 
server.listen(() => {
  logger.cyan(`Proxy gateway is listening on port ${config.gateway.port}`, "prod");
});

server.on("connectionClosed", ( params: TParams ) => {
    logger.log(`Connection ${params.connectionId} closed`, "dev");
    logger.log(`Send to client: ${params.stats.srcTxBytes}b, received from client: ${params.stats.srcRxBytes}b, sent to server: ${params.stats.trgTxBytes}b, received from server: ${params.stats.trgRxBytes}b`, "debug");
});

server.on("requestFailed", ( params: TParams ) => {
    logger.error(`Request ${params.request.url} failed`, "prod");
    logger.error(params.error, "prod");
});