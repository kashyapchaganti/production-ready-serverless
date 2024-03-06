import {Stack,StackProps} from "aws-cdk-lib";
import {Runtime,Code, Function} from "aws-cdk-lib/aws-lambda";
import {RestApi, LambdaIntegration, StageOptions} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export interface myStackProps extends StackProps{
    stageName:string;
    restaurantsTable:Table;
}

export class ApiStack extends Stack{
    constructor(scope: Construct, id:string, props:myStackProps){
        super(scope, id, props);
        const lambdaFunction = new Function(this, 'GetIndex', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'get-index.handler',
            code: Code.fromAsset('functions')
        })
        const api = new RestApi(this, `MyApi-${props.stageName}`, {
            deployOptions:{
                stageName: props.stageName}
        });
        const lambdaIntegration = new LambdaIntegration(lambdaFunction);
        api.root.addMethod("GET", lambdaIntegration);


        const restaurantLambdaFunction = new Function(this, `GetRestaurants-${props.stageName}`, {
            runtime: Runtime.NODEJS_18_X,
            handler: `get-restaurants.handler`,
            code: Code.fromAsset("functions"),
            environment:{
                default_results: `8`,
                restaurants_table: props.restaurantsTable.tableName
            }
        })
        props.restaurantsTable.grantReadData(restaurantLambdaFunction);
        const restaurantLambdaIntegration = new LambdaIntegration(restaurantLambdaFunction);
        api.root.addResource("restaurants").addMethod("GET", restaurantLambdaIntegration);

    }
}
module.exports = {ApiStack};