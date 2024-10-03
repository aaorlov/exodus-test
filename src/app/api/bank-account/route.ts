import { cookies } from "next/headers";
import * as jose from "jose";
import { NextResponse } from "next/server";
import {BankAccountDAO} from "@/lib/db/bankAccount";

export const GET = async () => {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");

  const userId = payload.sub || '';

  const accounts = await BankAccountDAO.getAllBankAccounts(userId)

  return NextResponse.json({ accounts }, { status: 200 });
}
