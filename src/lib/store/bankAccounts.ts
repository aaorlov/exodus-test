import { create } from 'zustand'
import {Hanko} from "@teamhanko/hanko-elements";

const initialBankAccountsState = {
  accounts: [],
  loading: true,
  error: null
}

interface IBankAccountsState {
  accounts: any[]
  loading: boolean
  error: any
}

export interface IBankAccountsStore extends IBankAccountsState {
  getAccounts: () => Promise<any[]>
  reset: () => void
}

export const useBankAccountsStore = create<IBankAccountsStore>((set) => ({
  ...initialBankAccountsState,
  getAccounts: async () => {
    try {
      set({ loading: true, error: null })
      const hanko = new Hanko(process.env.NEXT_PUBLIC_HANKO_API_URL || "")
      const res = await fetch('/api/bank-account', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${hanko.session.get().jwt}`,
        },
      })

      const data = await res.json();

      if (!res.ok) throw {status: res.status, ...data}

      set({ accounts: data.accounts })

      return data.accounts
    } catch (error: any) {
      if(error?.status === 404) {
        set({ accounts: [] })
        return []
      }
      set({ error })
      throw error
    } finally {
      set({ loading: false })
    }
  },
  reset: () => set(initialBankAccountsState),
}))