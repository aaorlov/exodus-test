import { create } from 'zustand'
import {Hanko} from "@teamhanko/hanko-elements";

interface IUser {
  id: string
  email: string
  name: string
  username: string
  image: string
  address: string
}

interface IProfileState {
  profile: IUser | null
  loading: boolean
  error: any
  loadingUpdate: boolean
  errorUpdate: any
}

export interface IProfileStore extends IProfileState {
  getProfile: () => Promise<IUser | null>
  getBitcoin: (address: string) => Promise<any>
  createOrUpdateProfile: (user: any) => Promise<any>
  reset: () => void
}

const initialProfileState: IProfileState = {
  profile: null,
  loading: true,
  error: null,
  loadingUpdate: false,
  errorUpdate: null
}

export const useProfileStore = create<IProfileStore>((set) => ({
  ...initialProfileState,
  getProfile: async (): Promise<IUser | null> => {
    try {
      set({ loading: true, error: null })
      const hanko = new Hanko(process.env.NEXT_PUBLIC_HANKO_API_URL || "")
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${hanko.session.get().jwt}`,
        },
      })

      const data = await res.json();

      if (!res.ok) throw {status: res.status, ...data}

      set({ profile: data.profile })

      return data.profile
    } catch (error: any) {
      if(error?.status === 404) {
        set({ profile: null })
        return null
      }
      set({ error })
      throw error
    } finally {
      set({ loading: false })
    }
  },
  getBitcoin: async (address: string): Promise<any> => {
    try {
      const hanko = new Hanko(process.env.NEXT_PUBLIC_HANKO_API_URL || "")
      const res = await fetch(`/api/bitcoin/${address}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${hanko.session.get().jwt}`,
        },
      })

      const data = await res.json();

      if (!res.ok) throw {status: res.status, ...data}

      return data
    } catch (error: any) {
      throw error
    }
  },
  createOrUpdateProfile: async (profileData: Partial<IUser>) => {
    try {
      set({ loadingUpdate: true, errorUpdate: null })
      const hanko = new Hanko(process.env.NEXT_PUBLIC_HANKO_API_URL || "")

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hanko.session.get().jwt}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await res.json();

      if (!res.ok) throw {status: res.status, ...data}

      set({ profile: data.profile })

      return data.profile
    } catch (error) {
      set({ error })
      throw error
    } finally {
      set({ loadingUpdate: false })
    }
  },
  reset: () => set(initialProfileState),
}))