import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  JsonObject,
  NodeApiError,
  NodeConnectionTypes,
} from "n8n-workflow";

import {
  paystackApiRequest,
  extractData,
  PaystackResponse,
} from "./GenericFunctions";

export class Paystack implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Paystack",
    name: "paystack",
    icon: "file:paystack.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: "Interact with Paystack API",
    defaults: {
      name: "Paystack",
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "paystackApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        description: "The resource to perform operations on",
        options: [
          { name: "Balance", value: "balance" },
          { name: "Customer", value: "customer" },
          { name: "Plan", value: "plan" },
          { name: "Refund", value: "refund" },
          { name: "Subscription", value: "subscription" },
          { name: "Transaction", value: "transaction" },
          { name: "Transfer", value: "transfer" },
        ],
        default: "transaction",
      },
      // TRANSACTION OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["transaction"],
          },
        },
        options: [
          {
            name: "Fetch",
            value: "fetch",
            description: "Get a transaction",
            action: "Fetch a transaction",
          },
          {
            name: "Initialize",
            value: "initialize",
            description: "Initialize a transaction",
            action: "Initialize a transaction",
          },
          {
            name: "List",
            value: "list",
            description: "List transactions",
            action: "List transactions",
          },
          {
            name: "Verify",
            value: "verify",
            description: "Verify a transaction",
            action: "Verify a transaction",
          },
        ],
        default: "initialize",
      },
      // TRANSACTION FIELDS
      {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "name@email.com",
        required: true,
        displayOptions: {
          show: {
            resource: ["transaction"],
            operation: ["initialize"],
          },
        },
        default: "",
        description: "Customer's email address",
      },
      {
        displayName: "Amount",
        name: "amount",
        type: "number",
        required: true,
        displayOptions: {
          show: {
            resource: ["transaction"],
            operation: ["initialize"],
          },
        },
        default: 0,
        description: "Amount in kobo (if NGN) or subunit of currency",
      },
      {
        displayName: "Metadata",
        name: "metadata",
        type: "fixedCollection",
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            resource: ["transaction"],
            operation: ["initialize"],
          },
        },
        default: {},
        description:
          "Custom data returned by Paystack in transaction webhook events",
        options: [
          {
            displayName: "Metadata",
            name: "values",
            values: [
              {
                displayName: "Key",
                name: "key",
                type: "string",
                default: "",
                required: true,
                description: "The metadata property name",
              },
              {
                displayName: "Value",
                name: "value",
                type: "string",
                default: "",
                description: "The metadata property value",
              },
            ],
          },
        ],
      },
      {
        displayName: "Transaction ID or Reference",
        name: "transactionId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transaction"],
            operation: ["fetch", "verify"],
          },
        },
        default: "",
        description: "The ID or reference of the transaction",
      },
      // CUSTOMER OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["customer"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a customer",
            action: "Create a customer",
          },
          {
            name: "Fetch",
            value: "fetch",
            description: "Get a customer",
            action: "Fetch a customer",
          },
          {
            name: "List",
            value: "list",
            description: "List customers",
            action: "List customers",
          },
          {
            name: "Update",
            value: "update",
            description: "Update a customer",
            action: "Update a customer",
          },
        ],
        default: "create",
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        placeholder: "name@email.com",
        required: true,
        displayOptions: {
          show: {
            resource: ["customer"],
            operation: ["create"],
          },
        },
        default: "",
        description: "Customer email address",
      },
      {
        displayName: "Customer ID or Code",
        name: "customerId",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["customer"],
            operation: ["fetch", "update"],
          },
        },
        default: "",
        description: "The ID or code of the customer",
      },
      // REFUND OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["refund"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a refund",
            action: "Create a refund",
          },
          {
            name: "List",
            value: "list",
            description: "List refunds",
            action: "List refunds",
          },
        ],
        default: "create",
      },
      {
        displayName: "Transaction Reference",
        name: "transaction",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["refund"],
            operation: ["create"],
          },
        },
        default: "",
        description: "Transaction reference or ID",
      },
      // PLAN OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["plan"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a plan",
            action: "Create a plan",
          },
          {
            name: "List",
            value: "list",
            description: "List plans",
            action: "List plans",
          },
        ],
        default: "create",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["plan"],
            operation: ["create"],
          },
        },
        default: "",
        description: "The name of the plan",
      },
      {
        displayName: "Interval",
        name: "interval",
        type: "options",
        description: "The interval of the plan",
        options: [
          { name: "Annually", value: "annually" },
          { name: "Biannually", value: "biannually" },
          { name: "Daily", value: "daily" },
          { name: "Monthly", value: "monthly" },
          { name: "Quarterly", value: "quarterly" },
          { name: "Weekly", value: "weekly" },
        ],
        required: true,
        displayOptions: {
          show: {
            resource: ["plan"],
            operation: ["create"],
          },
        },
        default: "monthly",
      },
      {
        displayName: "Amount",
        name: "amount",
        type: "number",
        required: true,
        displayOptions: {
          show: {
            resource: ["plan"],
            operation: ["create"],
          },
        },
        default: 0,
        description: "The amount for the plan in kobo",
      },
      // SUBSCRIPTION OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["subscription"],
          },
        },
        options: [
          {
            name: "Create",
            value: "create",
            description: "Create a subscription",
            action: "Create a subscription",
          },
          {
            name: "Disable",
            value: "disable",
            description: "Disable a subscription",
            action: "Disable a subscription",
          },
          {
            name: "List",
            value: "list",
            description: "List subscriptions",
            action: "List subscriptions",
          },
        ],
        default: "create",
      },
      {
        displayName: "Customer",
        name: "customer",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["subscription"],
            operation: ["create"],
          },
        },
        default: "",
        description: "Customer email or code",
      },
      {
        displayName: "Plan",
        name: "plan",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["subscription"],
            operation: ["create"],
          },
        },
        default: "",
        description: "Plan code",
      },
      {
        displayName: "Subscription Code",
        name: "code",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["subscription"],
            operation: ["disable"],
          },
        },
        default: "",
        description: "The subscription code to disable",
      },
      {
        displayName: "Token",
        name: "token",
        type: "string",
        typeOptions: { password: true },
        required: true,
        displayOptions: {
          show: {
            resource: ["subscription"],
            operation: ["disable"],
          },
        },
        default: "",
        description: "Email token associated with the subscription",
      },
      // TRANSFER OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
          },
        },
        options: [
          {
            name: "Create Recipient",
            value: "createRecipient",
            action: "Create a transfer recipient",
          },
          {
            name: "Finalize",
            value: "finalize",
            action: "Finalize a transfer",
          },
          {
            name: "Initiate",
            value: "initiate",
            action: "Initiate a transfer",
          },
          { name: "List", value: "list", action: "List transfers" },
        ],
        default: "initiate",
      },
      {
        displayName: "Name",
        name: "name",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["createRecipient"],
          },
        },
        default: "",
        description: "The name of the recipient",
      },
      {
        displayName: "Account Number",
        name: "account_number",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["createRecipient"],
          },
        },
        default: "",
        description: "The bank account number",
      },
      {
        displayName: "Bank Code",
        name: "bank_code",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["createRecipient"],
          },
        },
        default: "",
        description: "The bank code (e.g. 058 for GTBank)",
      },
      {
        displayName: "Recipient Code",
        name: "recipient",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["initiate"],
          },
        },
        default: "",
        description: "The code of the recipient",
      },
      {
        displayName: "Amount",
        name: "amount",
        type: "number",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["initiate"],
          },
        },
        default: 0,
        description: "The amount to transfer in kobo",
      },
      {
        displayName: "Transfer Code",
        name: "transfer_code",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["finalize"],
          },
        },
        default: "",
        description: "The transfer code to finalize",
      },
      {
        displayName: "OTP",
        name: "otp",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["transfer"],
            operation: ["finalize"],
          },
        },
        default: "",
        description: "The OTP sent to your phone or email",
      },
      // BALANCE OPERATIONS
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ["balance"],
          },
        },
        options: [
          {
            name: "Fetch Balance",
            value: "fetchBalance",
            action: "Fetch account balance",
          },
          { name: "List Banks", value: "listBanks", action: "List banks" },
          {
            name: "Resolve Account",
            value: "resolveAccount",
            action: "Resolve bank account",
          },
        ],
        default: "fetchBalance",
      },
      {
        displayName: "Account Number",
        name: "account_number",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["balance"],
            operation: ["resolveAccount"],
          },
        },
        default: "",
        description: "The bank account number to resolve",
      },
      {
        displayName: "Bank Code",
        name: "bank_code",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            resource: ["balance"],
            operation: ["resolveAccount"],
          },
        },
        default: "",
        description: "The code of the bank",
      },
    ],
    usableAsTool: true,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: PaystackResponse = {};

        if (resource === "transaction") {
          if (operation === "initialize") {
            const body: IDataObject = {
              email: this.getNodeParameter("email", i),
              amount: this.getNodeParameter("amount", i),
            };

            const metadata = this.getNodeParameter("metadata", i, {}) as {
              values?: Array<{ key: string; value: string }>;
            };

            if (metadata.values?.length) {
              body.metadata = Object.fromEntries(
                metadata.values.map(({ key, value }) => [key, value]),
              );
            }

            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/transaction/initialize",
              body,
            );
          } else if (operation === "verify") {
            const reference = this.getNodeParameter("transactionId", i);
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              `/transaction/verify/${reference}`,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/transaction",
            );
          } else if (operation === "fetch") {
            const id = this.getNodeParameter("transactionId", i);
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              `/transaction/${id}`,
            );
          }
        } else if (resource === "customer") {
          if (operation === "create") {
            const body: IDataObject = {
              email: this.getNodeParameter("email", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/customer",
              body,
            );
          } else if (operation === "fetch") {
            const id = this.getNodeParameter("customerId", i);
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              `/customer/${id}`,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/customer",
            );
          } else if (operation === "update") {
            const id = this.getNodeParameter("customerId", i);
            responseData = await paystackApiRequest.call(
              this,
              "PUT",
              `/customer/${id}`,
              {},
            );
          }
        } else if (resource === "refund") {
          if (operation === "create") {
            const body: IDataObject = {
              transaction: this.getNodeParameter("transaction", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/refund",
              body,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/refund",
            );
          }
        } else if (resource === "plan") {
          if (operation === "create") {
            const body: IDataObject = {
              name: this.getNodeParameter("name", i),
              interval: this.getNodeParameter("interval", i),
              amount: this.getNodeParameter("amount", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/plan",
              body,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(this, "GET", "/plan");
          }
        } else if (resource === "subscription") {
          if (operation === "create") {
            const body: IDataObject = {
              customer: this.getNodeParameter("customer", i),
              plan: this.getNodeParameter("plan", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/subscription",
              body,
            );
          } else if (operation === "disable") {
            const body: IDataObject = {
              code: this.getNodeParameter("code", i),
              token: this.getNodeParameter("token", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/subscription/disable",
              body,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/subscription",
            );
          }
        } else if (resource === "transfer") {
          if (operation === "createRecipient") {
            const body: IDataObject = {
              type: "nuban",
              name: this.getNodeParameter("name", i),
              account_number: this.getNodeParameter("account_number", i),
              bank_code: this.getNodeParameter("bank_code", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/transferrecipient",
              body,
            );
          } else if (operation === "initiate") {
            const body: IDataObject = {
              source: "balance",
              amount: this.getNodeParameter("amount", i),
              recipient: this.getNodeParameter("recipient", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/transfer",
              body,
            );
          } else if (operation === "finalize") {
            const body: IDataObject = {
              transfer_code: this.getNodeParameter("transfer_code", i),
              otp: this.getNodeParameter("otp", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "POST",
              "/transfer/finalize_transfer",
              body,
            );
          } else if (operation === "list") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/transfer",
            );
          }
        } else if (resource === "balance") {
          if (operation === "fetchBalance") {
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/balance",
            );
          } else if (operation === "listBanks") {
            responseData = await paystackApiRequest.call(this, "GET", "/bank");
          } else if (operation === "resolveAccount") {
            const qs: IDataObject = {
              account_number: this.getNodeParameter("account_number", i),
              bank_code: this.getNodeParameter("bank_code", i),
            };
            responseData = await paystackApiRequest.call(
              this,
              "GET",
              "/bank/resolve",
              {},
              qs,
            );
          }
        }

        const executionData = this.helpers
          .returnJsonArray(extractData(responseData))
          .map((data) => ({
            ...data,
            pairedItem: { item: i },
          }));
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          returnData.push({
            json: { error: message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
