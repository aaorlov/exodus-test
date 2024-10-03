'use client';

import {RegisterForm} from "@/components/form/register-form";
import {useProfileStore} from "@/lib/store/profile";
import Box from "@mui/material/Box";
import {AppBar, CssBaseline, IconButton, Toolbar} from "@mui/material";
import {ArrowBack, Logout} from "@mui/icons-material";
import {useRouter} from "next/navigation";
import {LOGIN} from "@/constants/routes";
import {useHankoData} from "@/hooks/useHankoData";
import Typography from "@mui/material/Typography";


const ProfilePage = () => {
  const router = useRouter();
  const {hanko} = useHankoData();
  const {createOrUpdateProfile} = useProfileStore()

  const logout = async () => {
    try {
      await hanko?.user.logout();
      router.push(LOGIN);
      router.refresh();
      return;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={logout}>
            <Logout />
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