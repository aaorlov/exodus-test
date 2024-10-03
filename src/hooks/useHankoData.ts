import { useState, useEffect } from "react";
import { Hanko } from "@teamhanko/hanko-elements";
import * as jose from "jose";
import {JWTPayload} from "jose";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";

interface HankoSession {
  parsed: JWTPayload | null;
  jwt: string;
  isValid: boolean;
  loading: boolean;
  error: string | null;
}

interface HankoUser {
  id: string;
  email: string;
  loading: boolean;
  error: string | null;
}

interface HankoData {
  user: HankoUser;
  session: HankoSession;
  hanko?: Hanko;
}

export function useHankoData(): HankoData {
  const [hanko, setHanko] = useState<Hanko>();
  const [sessionState, setSessionState] = useState<HankoSession>({
    parsed: null,
    jwt: '',
    isValid: false,
    loading: true,
    error: null,
  });

  const [userState, setUserState] = useState<HankoUser>({
    id: "",
    email: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi))
    );
  }, []);

  useEffect(() => {
    if (hanko) {
      const isValid = hanko.session.isValid();
      const session = hanko.session.get();

      hanko?.user
        .getCurrent()
        .then(({ id, email = '' }) => {
          setUserState({ id, email, loading: false, error: null });
        })
        .catch((error) => {
          setUserState((prevState) => ({ ...prevState, loading: false, error }));
        });
      if (isValid && session) {
        const { jwt = "" } = session;
        const parsed: JWTPayload = jose.decodeJwt(jwt);
        setSessionState({
          parsed,
          jwt,
          isValid,
          loading: false,
          error: null,
        });
      } else {
        setSessionState({
          parsed: null,
          jwt: '',
          isValid: false,
          loading: true,
          error: "Invalid session",
        });
      }
    }
  }, [hanko]);

  return {session: sessionState, user: userState, hanko};
}
