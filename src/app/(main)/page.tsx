'use client';

import { useEffect } from "react";
import {useProfileStore} from "@/lib/store/profile";
import {useRouter} from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import {Person as PersonIcon, Logout as LogoutIcon} from '@mui/icons-material';

import PlaidLinkBtn from "@/components/plaid-link-btn";
import {LOGIN} from "@/constants/routes";
import {useHankoData} from "@/hooks/useHankoData";
import {
  Accordion, AccordionDetails,
  AccordionSummary,
  AppBar,
  CircularProgress,
  CssBaseline,
  Drawer,
  Toolbar
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useBankAccountsStore} from "@/lib/store/bankAccounts";


function ExpandMoreIcon() {
  return null;
}

const Home = () => {
  const router = useRouter();
  const {hanko} = useHankoData();
  const {profile, loading, getProfile, getBitcoin} = useProfileStore()
  const {accounts, loading: accountLoading, getAccounts} = useBankAccountsStore()

  useEffect(() => {
    getProfile().then(profile => getBitcoin((profile as any).bitcoinAddress)).then(res => console.log(`12`, res))
    getAccounts()
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if(!profile) {
    return router.replace('/profile')
  }

  return (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - 240px)`, ml: `240px` }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.push('/profile')}>
            <ListItemIcon>
              <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={logout}>
          <ListItemIcon>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      <Toolbar />
      {!accounts.length && <PlaidLinkBtn userId={profile.id} disabled={accountLoading} />}
      {
        accountLoading ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : accounts.map((account: any) => (
          <Accordion key={account.id} sx={{mt: 2}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={account.id}
            >
              <Typography variant="subtitle1">{account.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{p: 5}}>
              <Grid container spacing={2} direction="column">
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Official Name:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.officialName}</Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Account Mask:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.mask}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Subtype:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.subtype}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Type:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.type}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Available Balance:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.availableBalance ? `${account.availableBalance} ${account.currencyCode}` : 'N/A'}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Current Balance:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.currentBalance ? `${account.currentBalance} ${account.currencyCode}` : 'N/A'}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2"><strong>Account ID:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{account.accountId}</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body2"><strong>Created At:</strong></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">{new Date(account.createdAt).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body2"><strong>Updated At:</strong></Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2">{new Date(account.updatedAt).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      }

    </Box>
  </Box>
  );
}

export default Home;