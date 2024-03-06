import {RemovalPolicy, Stack, StackProps} from "aws-cdk-lib";
import { Attribute, AttributeType, BillingMode, Table  } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface myDBStackProps extends StackProps{
    stageName: string;
}

export class DatabaseTable extends Stack{
    restaurantsTable: Table;
    constructor(scope: Construct, id: string, props?: myDBStackProps){
        super(scope, id, props);
        const restaurantstable= new Table(this, "RestaurantsTable", {
            partitionKey:{
                name: 'name',
                type: AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })
        this.restaurantsTable = restaurantstable
    }
}