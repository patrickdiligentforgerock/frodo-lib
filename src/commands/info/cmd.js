import { Command } from 'commander';
import * as common from '../cmd_common.js';
import { getTokens } from '../../api/AuthApi.js';
import storage from '../../storage/SessionStorage.js';

export function setup() {
    const info = new Command("info"); 
    info
        .addArgument(common.hostArgumentM)
        .addArgument(common.userArgument)
        .addArgument(common.passwordArgument)
        .helpOption("-h, --help", "Help")
        .addOption(common.deploymentOption)
        .description("Print versions and tokens.")
        .action(async (host, user, password, options, command) => {
            storage.session.setTenant(host);
            storage.session.setUsername(user);
            storage.session.setPassword(password);
            storage.session.setDeploymentType(options.type);
            console.log("Printing versions and tokens...");
            if(await getTokens()) {
                console.log("Cookie name: " + storage.session.getCookieName());
                console.log("Session token: " + storage.session.getCookieValue());
                if (storage.session.getBearerToken()) {
                    console.log("Bearer token: " + storage.session.getBearerToken());
                }    
            }
        });
    info.showHelpAfterError();
    return info;
}