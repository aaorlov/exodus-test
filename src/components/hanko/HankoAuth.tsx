"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register, Hanko } from "@teamhanko/hanko-elements";
import {DEFAULT_LOGIN_REDIRECT, LOGIN} from "@/constants/routes";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || '';

export default function HankoAuth() {
  const router = useRouter();
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    register(hankoApi).then(({ hanko: h }) => setHanko(h)).catch(console.error);
  }, []);

  useEffect(() => {
    if(hanko) {
      hanko.onSessionCreated(() => router.replace(DEFAULT_LOGIN_REDIRECT));
      hanko.onSessionExpired(() => router.replace(LOGIN));
    }
  }, [hanko, router]);

  return <hanko-auth />;
}
