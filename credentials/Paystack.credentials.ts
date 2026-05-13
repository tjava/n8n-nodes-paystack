import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Paystack implements ICredentialType {
	name = 'paystackApi';

	displayName = 'Paystack API';

	documentationUrl = 'https://paystack.com/docs/api/';

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.secretKey}}',
			},
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Paystack secret key. Found in Settings → API Keys & Webhooks on your Paystack dashboard.',
			placeholder: 'sk_live_xxxxxxxxxxxx or sk_test_xxxxxxxxxxxx',
		},
	];
}
