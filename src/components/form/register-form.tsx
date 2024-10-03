"use client";

import React, {useEffect, useState, useTransition} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Snackbar from '@mui/material/Snackbar';
import {Alert} from "@mui/material";

import {DEFAULT_LOGIN_REDIRECT} from "@/constants/routes";
import { registerSchema } from "@/lib/schemas";
import {SignInContainer, Card} from "@/components/form/styled";
import {useHankoData} from "@/hooks/useHankoData";

export const RegisterForm = ({createProfile, profile}: any) => {
  const [snack, setSnack] = useState({open: false, type: 'success', message: ''});
  const {user} = useHankoData()
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {handleSubmit, control, formState: {isSubmitted}, setValue} = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: profile.email || "",
      name: profile.name || "",
      address: profile.address || "",
    },
  });

  useEffect(() => {
    if(user?.email) setValue("email", user?.email);
  }, [setValue, user?.email]);

  const onSubmit = handleSubmit((values) => {
    console.log(values);
    startTransition(() => {
      createProfile(values)
        .then(() => router.push(DEFAULT_LOGIN_REDIRECT))
        .catch(() => setSnack({open: true, type: 'error', message: 'Something went wrong.'}));
    });
  });

  const closeSnack = () => setSnack({open: false, type: 'success', message: ''});

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Add your data
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <TextField
              type="email"
              id="email"
              autoComplete="email"
              fullWidth
              value={user?.email ?? ""}
              variant="outlined"
              disabled
              color="primary"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error = null, invalid } }) => <TextField
                error={invalid && isSubmitted}
                helperText={error && isSubmitted ? error.message : null}
                placeholder="e.g. John Doe"
                type="text"
                id="name"
                autoComplete="name"
                autoFocus
                fullWidth
                onChange={field.onChange}
                value={field.value}
                variant="outlined"
                color={invalid && isSubmitted ? 'error' : 'primary'}
              />}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="address">Address</FormLabel>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error = null, invalid } }) => <TextField
                error={invalid && isSubmitted}
                helperText={error && isSubmitted ? error.message : null}
                placeholder="e.g. 123 Main St, Anytown USA"
                type="text"
                id="address"
                autoComplete="address"
                fullWidth
                onChange={field.onChange}
                value={field.value}
                variant="outlined"
                color={invalid && isSubmitted ? 'error' : 'primary'}
              />}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            disabled={isPending}
            variant="contained"
          >
            Update
          </Button>
        </Box>
      </Card>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
        <Alert severity={snack.type as any}>{snack.message}</Alert>
      </Snackbar>
    </SignInContainer>
  );
}
