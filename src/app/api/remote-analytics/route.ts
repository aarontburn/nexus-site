import { NextRequest, NextResponse } from 'next/server';
import { RemoteAnalyticTypes } from '../../analytics/analytics-schema';
import { Collections, connectToDatabase } from "../../marketplace/server/module-database/connect";
import { BaseAnalytic } from "../../analytics/analytics-schema";

interface Param {
    paramName: string,
    type: "string" | "number" | "boolean",
    required?: boolean | undefined
}

interface ValidatedRequestBody {
    type: string,
    [inputParams: string]: string | number | boolean
}

const REQUIRED_PARAMS_PER_ANALYTIC_TYPE: { [K in RemoteAnalyticTypes]: Param[] } = {
    "REMOTE_CLIENT_FIRST_BOOT": [],
    "REMOTE_CLIENT_UPDATED": [{ paramName: "oldVersion", type: "string" }, { paramName: "newVersion", type: "string" }],
    "REMOTE_INSTALLED_MODULE": [{ paramName: "moduleId", type: "string" }],
    "REMOTE_CLIENT_UNINSTALL": [],
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validationResult: string | ValidatedRequestBody = validateBodyPerAnalyticType(body);

        if (typeof validationResult === "string") {
            console.error(`Rejected remote analytic event for reason: ${validationResult}`);
            return NextResponse.json({ received: JSON.stringify(request) }, { status: 400 });
        }

        console.info(`Received valid remote analytic event.`);
        createRemoteAnalytic(validationResult, body["isDevTest"] !== undefined);

        return NextResponse.json({}, { status: 201 });

    } catch (error) {
        return NextResponse.json({}, { status: 400 });
    }
}


function validateBodyPerAnalyticType(body: any): string | ValidatedRequestBody {
    if (body["NEXUS_TYPE"] === undefined) 
        return "MISSING NEXUS_TYPE";

    if (typeof body["NEXUS_TYPE"] !== "string") 
        return "INVALID_VAR_TYPE NEXUS_TYPE";

    if (!Object.keys(REQUIRED_PARAMS_PER_ANALYTIC_TYPE).includes(body["NEXUS_TYPE"])) 
        return "INVALID_TYPE NEXUS_TYPE";

    const params: Param[] = REQUIRED_PARAMS_PER_ANALYTIC_TYPE[body["NEXUS_TYPE"] as RemoteAnalyticTypes];

    const returnObj: ValidatedRequestBody = {
        type: body["NEXUS_TYPE"],
    }

    for (const param of params) {
        const inputValue = body[param.paramName];
        if (param.required && inputValue === undefined) 
            return `MISSING_REQUIRED_PARAM ${param.paramName}`;

        if (inputValue && typeof inputValue !== param.type) 
            return `INVALID_VAR_TYPE ${param.paramName}`;

        returnObj[param.paramName] = inputValue ?? null;
    }
    return returnObj
}

async function createRemoteAnalytic(analytic: ValidatedRequestBody, isDevTest: boolean) {
    const collections: Collections = await connectToDatabase();

    const uploaded: any = {
        ...analytic,
        isRemote: true,
        date: new Date(),
    }


    if (isDevTest) {
        console.info("Did not post analytic since analytic is marked as isDevTest");
        console.info(`${JSON.stringify(uploaded)}`)
    }


    await collections.ANALYTIC_COLLECTION.insertOne(uploaded);
}