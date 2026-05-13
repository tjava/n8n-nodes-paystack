# n8n-nodes-paystack

This is an n8n community node to interact with [Paystack](https://paystack.com/), a leading payment gateway in Africa.

[Paystack](https://paystack.com/) allows businesses to accept payments via various channels including cards, bank transfers, USSD, and mobile money.

## Features

- **Transactions**: Initialize, verify, fetch, and list transactions.
- **Customers**: Create, update, fetch, and list customers.
- **Plans & Subscriptions**: Manage recurring billing.
- **Refunds**: Process and track refunds.
- **Transfers**: Create recipients and initiate transfers.
- **Balance & Banks**: Check your balance and resolve bank accounts.
- **Webhook Trigger**: Listen for real-time events from Paystack.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install n8n-nodes-paystack
```

## Credentials

To use this node, you need a Paystack account.

1. Go to your [Paystack Dashboard](https://dashboard.paystack.com/).
2. Navigate to **Settings** > **API Keys & Webhooks**.
3. Copy your **Secret Key** (use the `sk_test_...` key for testing and `sk_live_...` for production).
4. In n8n, create a new **Paystack API** credential and paste your Secret Key.

## Operations

### Transaction
- **Initialize**: Start a new transaction.
- **Verify**: Confirm the status of a transaction using its reference.
- **Fetch**: Get details of a single transaction.
- **List**: Retrieve a list of your transactions.

### Customer
- **Create**: Add a new customer to your integration.
- **Update**: Modify an existing customer's details.
- **Fetch**: Get a customer's profile.
- **List**: Retrieve your customer list.

### Refund
- **Create**: Initiate a refund for a transaction.
- **List**: View previous refunds.

### Plan
- **Create**: Set up a new recurring billing plan.
- **List**: View all your plans.

### Subscription
- **Create**: Enroll a customer in a plan.
- **Disable**: Cancel a subscription.
- **List**: View all subscriptions.

### Transfer
- **Create Recipient**: Set up a destination for transfers.
- **Initiate**: Send money to a recipient.
- **Finalize**: Complete a transfer requiring OTP.
- **List**: View transfer history.

### Balance
- **Fetch Balance**: See your current Paystack account balance.
- **List Banks**: Get a list of supported banks and their codes.
- **Resolve Account**: Verify a bank account number.

## Usage

### Webhook Trigger
Use the **Paystack Trigger** node to receive notifications for events like `charge.success`, `transfer.success`, and `subscription.create`. Ensure you copy the Webhook URL from the node and paste it into your Paystack Dashboard settings.

## Development

1. Clone the repository:
```bash
git clone https://github.com/tjava/n8n-nodes-paystack.git
```
2. Install dependencies:
```bash
npm install
```
3. Build the node:
```bash
npm run build
```
4. Link for local development:
```bash
npm link
```
5. In your local n8n directory:
```bash
npm link n8n-nodes-paystack
```

## License

[MIT](LICENSE)

