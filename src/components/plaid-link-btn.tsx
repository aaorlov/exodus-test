"use client"
import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import Button from "@mui/material/Button";
import {useBankAccountsStore} from "@/lib/store/bankAccounts";

const PlaidLinkComponent = ({userId, disabled}: any) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const {getAccounts} = useBankAccountsStore()

  useEffect(() => {
    fetch('/api/plaid/create-link-token', {
      method: 'POST',
      body: JSON.stringify({ client_user_id: userId })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLinkToken(data.link_token)
      })
      .catch((error) => console.error('Error generating link token:', error));
  }, []);

  const onSuccess = async (public_token: string) => {
    try {
      const response = await fetch('/api/plaid/exchange-token', {
        method: 'POST',
        body: JSON.stringify({
          public_token,
        })
      });

      const data = await response.json();
      getAccounts()
      console.log('Access Token:', data.access_token);
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });


  return <Button variant="contained" onClick={() => open && open()} disabled={!ready || disabled}>Connect Bank</Button>
};
export default PlaidLinkComponent;