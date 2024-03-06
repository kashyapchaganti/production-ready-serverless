#!/usr/bin/env node 

import {App} from "aws-cdk-lib";
import {ApiStack} from "./constructs/api-stack";
import {DatabaseTable} from "./constructs/database-stack";

const app = new App();
let stageName = app.node.tryGetContext("stageName");
if(!stageName){
    console.log("Defaulting stagename to dev");
    stageName= 'dev';
}
const ddb = new DatabaseTable(app,`DatabaseStack-${stageName}`,{stageName});
new ApiStack(app,`ApiStack-${stageName}`,{stageName, restaurantsTable:ddb.restaurantsTable});