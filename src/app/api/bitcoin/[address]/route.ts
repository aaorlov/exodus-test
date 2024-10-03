import { RegtestUtils } from 'regtest-client';
import { NextResponse } from "next/server";


const APIPASS = process.env.APIPASS || 'satoshi';
const APIURL = process.env.APIURL || 'https://regtest.bitbank.cc/1';

const regtestUtils = new RegtestUtils({ APIPASS, APIURL });
const dhttp = regtestUtils.dhttp;

export const GET = async (req: any, { params }: { params: { address: string } }) => {
  const { address } = params;

  const result = await dhttp({
    method: 'GET',
    url: 'https://blockchain.info/rawaddr/' + address,
  });

  return NextResponse.json(result, { status: 200 });
}