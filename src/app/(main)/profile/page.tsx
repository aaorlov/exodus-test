'use client';

import {RegisterForm} from "@/components/form/register-form";
import {useProfileStore} from "@/lib/store/profile";
import Box from "@mui/material/Box";
import {AppBar, CssBaseline, IconButton, Toolbar} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/navigation";


const ProfilePage = () => {
  const router = useRouter();
  const {createOrUpdateProfile} = useProfileStore()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => router.back()}
            sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <RegisterForm createProfile={createOrUpdateProfile}/>
      </Box>
    </Box>
  )
}
export default ProfilePage;