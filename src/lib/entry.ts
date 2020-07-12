import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import * as Ajv from "ajv";
import jtomler from "jtomler";
import json_from_schema from "json-from-default-schema";
import * as config_schema from "./config_schema.json";

type TConfig = {
    logger: {
        mode: string
        enable: boolean
    }
    auth: {
        enable: boolean
        users: {
            login: string
            password: string
        }[]
    }
    gateway: {
        port: number
        proxies: string[]
    }
}

const pkg = finder(__dirname).next().value;

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file.");
program.option("-p, --proxies <type>", "Path to proxies file.");

program.parse(process.argv);

if (program.config === undefined) {
    console.error(chalk.red("Not set --config key"));
    process.exit(1);
}

const full_config_path = path.resolve(process.cwd(), program.config);

if (!fs.existsSync(full_config_path)) {
    console.error(chalk.red(`Config file ${full_config_path} not found`));
    process.exit(1);
}

const config: TConfig = <TConfig>json_from_schema(jtomler(full_config_path), config_schema);

const ajv = new Ajv();
const validate = ajv.compile(config_schema);

const valid = validate(config);

if (!valid) {
    throw new Error(`Config file ${full_config_path} does not match schema, errors:\n${JSON.stringify(validate.errors, null, 2)}`);
}

if (program.proxies !== undefined) {

    const full_proxies_path = path.resolve(process.cwd(), program.proxies);

    if (!fs.existsSync(full_proxies_path)) {
        console.error(chalk.red(`Proxies file ${full_proxies_path} not found`));
        process.exit(1);
    }

    const proxies_content = fs.readFileSync(full_proxies_path).toString();
    const proxies_list = proxies_content.split("\n");
    const reg = /^(http|https)\:\/\/(.*\:.*@|).*\:[0-9]{1,5}$/;

    for (const index in proxies_list) {

        const proxy_url: string = proxies_list[index].trim();

        if (!reg.test(proxy_url)) {
            console.error(chalk.red(`String "${proxy_url}" does not match template ^(http|https)\:\/\/(.*\:.*@|).*\:[0-9]{1,5}$`));
            process.exit(1);
        }
        if (!config.gateway.proxies.includes(proxy_url)) {
            config.gateway.proxies.push(proxy_url);
        }
    }
   
}

export default config;