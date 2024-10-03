import { NextRequest, NextResponse } from 'next/server';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import {BankAccountDAO} from "@/lib/db/bankAccount";
import {cookies} from "next/headers";
import * as jose from "jose";

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const client = new PlaidApi(config);

export async function POST(req: NextRequest) {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");
  const { public_token } = await req.json();
  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = response.data;

    const accountsResponse = await client.accountsGet({
      access_token,
    });

    const bankAccounts = accountsResponse.data.accounts;

    const saveAccounts = bankAccounts.map(async (account) => {
      await BankAccountDAO.createBankAccount({
        userId: payload.sub,
        accountId: account.account_id,
        name: account.name,
        officialName: account.official_name,
        mask: account.mask,
        persistentAccountId: account.persistent_account_id,
        subtype: account.subtype,
        type: account.type,
        availableBalance: account.balances.available,
        currentBalance: account.balances.current,
        currencyCode: account.balances.iso_currency_code,
      });
    });

    await Promise.all(saveAccounts);

    return NextResponse.json({ access_token, item_id }, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error exchanging public token' }, { status: 500 });
  }
}