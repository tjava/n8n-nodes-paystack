import {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as crypto from 'crypto';

export class PaystackTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Paystack Trigger',
		name: 'paystackTrigger',
		icon: 'file:paystack.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Paystack webhooks',
		defaults: {
			name: 'Paystack Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'paystackApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Charge Success', value: 'charge.success' },
					{ name: 'Transfer Success', value: 'transfer.success' },
					{ name: 'Transfer Failed', value: 'transfer.failed' },
					{ name: 'Transfer Reversed', value: 'transfer.reversed' },
					{ name: 'Refund Processed', value: 'refund.processed' },
					{ name: 'Subscription Create', value: 'subscription.create' },
					{ name: 'Subscription Disable', value: 'subscription.disable' },
					{ name: 'Subscription Not Renewed', value: 'subscription.not_renewed' },
					{ name: 'Invoice Create', value: 'invoice.create' },
					{ name: 'Invoice Payment Failed', value: 'invoice.payment_failed' },
					{ name: 'Invoice Update', value: 'invoice.update' },
				],
				default: ['charge.success'],
				required: true,
				description: 'The events to listen for',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headerData = this.getHeaderData();
		const body = this.getBodyData() as any;
		const events = this.getNodeParameter('events') as string[];

		// Paystack Webhook Verification
		const credentials = await this.getCredentials('paystackApi');
		const secretKey = credentials.secretKey as string;
		const signature = headerData['x-paystack-signature'] as string;

		if (!signature) {
			return {
				noWebhookResponse: true,
			};
		}

		// Compute HMAC SHA512 signature
		const hash = crypto
			.createHmac('sha512', secretKey)
			.update(JSON.stringify(body))
			.digest('hex');

		if (hash !== signature) {
			return {
				noWebhookResponse: true,
			};
		}

		// Filter events if specified
		const eventType = body.event as string;
		if (events.length > 0 && !events.includes(eventType)) {
			return {
				noWebhookResponse: true,
			};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
