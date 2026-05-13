import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IDataObject,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

/**
 * Make an API request to Paystack
 */
export async function paystackApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	const options: IRequestOptions = {
		method,
		qs,
		body,
		url: uri || `https://api.paystack.co${endpoint}`,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'paystackApi', options);
}

/**
 * Clean object by removing empty, undefined or null values
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const finalObj: IDataObject = {};
	Object.keys(obj).forEach((key) => {
		if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
			finalObj[key] = obj[key];
		}
	});
	return finalObj;
}

/**
 * Extract data from Paystack response envelope
 */
export function extractData(response: JsonObject): any {
	if (response && response.status === true && response.data !== undefined) {
		return response.data;
	}
	return response;
}
