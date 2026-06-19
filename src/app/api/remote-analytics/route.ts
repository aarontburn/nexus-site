import { NextRequest, NextResponse } from 'next/server';
import { RemoteAnalyticTypes } from '../../analytics/analytics-schema';
import { Collections, connectToDatabase } from "../../marketplace/server/module-database/connect";
import { BaseAnalytic } from "../../analytics/analytics-schema";

interface Param {
    paramName: string,
    type: "string" | "number" | "boolean",
}

interface ValidatedRequestBody {
    type: string,
    [inputParams: string]: string | number | boolean
}

const REQUIRED_PARAMS_PER_ANALYTIC_TYPE: { [K in RemoteAnalyticTypes]: Param[] } = {
    "REMOTE_CLIENT_FIRST_BOOT": [
        { paramName: "uid", type: "string" }, 
    ],
    "REMOTE_CLIENT_UPDATED": [
        { paramName: "uid", type: "string" }, 
        { paramName: "oldVersion", type: "string" }, 
        { paramName: "newVersion", type: "string" },
    ],
    "REMOTE_INSTALLED_MODULE_FROM_SITE": [
        { paramName: "uid", type: "string" }, 
        { paramName: "moduleId", type: "string" },

    ],
    "REMOTE_IMPORTED_MODULE": [
        { paramName: "uid", type: "string" }, 
        { paramName: "moduleId", type: "string" },
    ],
    "REMOTE_CLIENT_UNINSTALL": [
        { paramName: "uid", type: "string" }, 
        { paramName: "moduleId", type: "string" },
    ],
    "REMOTE_UPDATED_MODULE": [
        { paramName: "uid", type: "string" }, 
        { paramName: "moduleId", type: "string" },
        { paramName: "oldVersion", type: "string" },
        { paramName: "newVersion", type: "string" },
    ],
    "REMOTE_CLIENT_ACTIVE": [
        { paramName: "uid", type: "string" }, 
    ]
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validationResult: string | ValidatedRequestBody = validateBodyPerAnalyticType(body);

        if (typeof validationResult === "string") {
            console.error(`Rejected remote analytic event for reason: ${validationResult}`);
            return NextResponse.json({ received: JSON.stringify(request) }, { status: 400 });
        }

        const isTestAnalytic: boolean = body["isDevTest"] !== undefined;
        if (isTestAnalytic) {
            console.info(`Received valid test analytic event: ${JSON.stringify(validationResult)}`);
        } else {
            console.info(`Received valid remote analytic event: ${JSON.stringify(validationResult)}`);
        }

        await createRemoteAnalytic(validationResult, isTestAnalytic);

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
        if (inputValue && typeof inputValue !== param.type) 
            return `INVALID_VAR_TYPE ${param.paramName}`;

        returnObj[param.paramName] = inputValue ?? null;
    }
    return returnObj
}

async function createRemoteAnalytic(analytic: ValidatedRequestBody, isTestAnalytic: boolean) {
    const collections: Collections = await connectToDatabase();

    const uploaded: any = {
        ...analytic,
        isRemote: true,
        date: new Date(),
    }

    if (isTestAnalytic) {
        uploaded["ttl"] = new Date();
    }

    if (process.env.ENABLE_ANALYTICS === "1") {
        await collections.ANALYTIC_COLLECTION.insertOne(uploaded);
    } else {
        console.warn("Analytics disabled.")
    }

}