import { cookies } from "next/headers";
import * as jose from "jose";
import { ECPairAPI, ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import { NextResponse } from "next/server";
import { UserDAO } from "@/lib/db/user";


export const GET = async () => {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");

  const userId = payload.sub || '';

  const profile = await UserDAO.getUserById(userId)

  if (profile) {
    return NextResponse.json({ profile }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
}

export const POST = async (req: any) => {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");

  const body = await req.json();

  const user = await UserDAO.getUserById(payload.sub || '')

  let profile
  if(user) {
    profile = await UserDAO.updateUser(payload.sub || '', body)
  } else {
    const network = bitcoin.networks.regtest;
    const ECPair: ECPairAPI = ECPairFactory(ecc);

    const keyPair = ECPair.makeRandom({ network });
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: network,
    });
    const privateKey = keyPair.toWIF()

    profile = await UserDAO.createUser({
      id: payload.sub,
      email: body.email,
      name: body.name,
      address: body.address,
      bitcoinAddress: address,
      privateKey
    })
  }

  if (profile) {
    return NextResponse.json({ profile }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
}
