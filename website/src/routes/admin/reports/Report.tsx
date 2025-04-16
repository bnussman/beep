import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Button,
  Typography,
  Stack,
  Avatar,
  Card,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import { Error } from "../../../components/Error";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { createRoute, useRouter } from "@tanstack/react-router";
import { reportsRoute } from ".";
import { RouterInput, trpc } from "../../../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { MailOutline } from "@mui/icons-material";

dayjs.extend(relativeTime);

export const reportRoute = createRoute({
  component: Report,
  path: "$reportId",
  getParentRoute: () => reportsRoute,
});

export function Report() {
  const { reportId } = reportRoute.useParams();
  const { history } = useRouter();
  const utils = trpc.useUtils();

  const {
    data: report,
    isLoading,
    error,
  } = trpc.report.report.useQuery(reportId);

  const reporterUserId = report?.reporter_id;
  const reportedUserId = report?.reported_id;

  const {
    data: reporter,
    isLoading: reporterLoading,
    error: reporterError,
  } = trpc.user.user.useQuery(reporterUserId as string, {
    enabled: !!reporterUserId,
  });

  const {
    data: reported,
    isLoading: reportedLoading,
    error: reportedError,
  } = trpc.user.user.useQuery(reportedUserId as string, {
    enabled: !!reportedUserId,
  });

  const { mutateAsync: emailUser, isPending: sending} = trpc.report.emailUser.useMutation({
    onSuccess() {
      setSendEmailTo('');
      emailForm.reset();
      setDisplaySendAlert({ isOpen: true, status: 'success', message: 'Email was successfully sent!'})
    },
    onError(error) {
      console.error(error.message);
      setDisplaySendAlert({ isOpen: true, status: 'error', message: 'Uh oh! Something went wrong when trying to send the email...'})
    }
  })

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError,
  } = trpc.report.updateReport.useMutation({
    onSuccess(report) {
      utils.report.report.invalidate(reportId);
      utils.report.reports.invalidate();
    },
  });

  const [sendEmailTo, setSendEmailTo] = React.useState('');
  const [displaySendAlert, setDisplaySendAlert] = React.useState({ isOpen: false, status: '', message: ''})

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  const values = {
    notes: report?.notes,
    handled: report?.handled,
  };

  const form = useForm({
    defaultValues: values,
    values,
  });

  const emailValues = {
    emailSubject: '',
    emailContent: ''
  };

  const emailForm = useForm({
    defaultValues: emailValues,
  });

  const onSubmit = (values: RouterInput["report"]["updateReport"]["data"]) => {
    updateReport({
      reportId,
      data: values,
    });
  };

  const sendEmail = (values: { emailSubject: string, emailContent: string }) => {
    emailUser({
      userEmail: sendEmailTo,
      ...values,
    })
  }

  if (isLoading || !report) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Report
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </Stack>
      <Card sx={{ p: 2, pt: 1 }} variant="outlined">
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            Details
          </Typography>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reporter</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={report.reporter.photo ?? undefined} />
              <Typography>
                {report.reporter.first} {report.reporter.last}
              </Typography>
              {
                (reporter && reporter.email) ? (
                  <Button endIcon={<MailOutline />} color="error" onClick={() => setSendEmailTo(reporter.email)}>Contact</Button>
                ) : null
              }
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reported</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={report.reported.photo ?? undefined} />
              <Typography>
                {report.reported.first} {report.reported.last}
              </Typography>
              {
                (reported && reported.email) ? (
                  <Button endIcon={<MailOutline />} color="error" onClick={() => setSendEmailTo(reported.email)}>Contact</Button>
                ) : null
              }
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reason</Typography>
            <Typography>{report.reason}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Date</Typography>
            <Typography>
              {new Date(report.timestamp).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <Card sx={{ p: 2 }} variant="outlined">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight="bold">
              Admin Notes
            </Typography>
            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <TextField
                  multiline
                  label="Notes"
                  rows={4}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Stack direction="row" justifyContent="space-between">
              <Controller
                control={form.control}
                name="handled"
                render={({ field }) => (
                  <FormControlLabel
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    control={<Checkbox />}
                    label="Handeled?"
                  />
                )}
              />
              <Button
                variant="contained"
                disabled={!form.formState.isDirty}
                type="submit"
                loading={isPending}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
      {
        sendEmailTo ? (
        <Card sx={{ p: 2, pt: 1 }} variant="outlined">
          <form onSubmit={emailForm.handleSubmit(sendEmail)}>
          <Stack spacing={4}>
          <Typography variant="h5" fontWeight="bold">Email</Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="body1" fontWeight="bold">To:</Typography>
            <Typography variant="body1">{sendEmailTo}</Typography>
          </Stack>
            <Controller
              control={emailForm.control}
              name="emailSubject"
              render={({ field, fieldState }) =>(
                <TextField
                label="Subject"
                value={field.value}
                onChange={field.onChange}
              />
            )}/>
            <Controller
              control={emailForm.control}
              name="emailContent"
              render={({ field, fieldState }) =>(
                <TextField
                multiline
                label="Write an email..."
                rows={4}
                value={field.value}
                onChange={field.onChange}
              />
            )}/>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                loading={sending}
                disabled={!(emailForm.watch('emailSubject') && emailForm.watch('emailContent'))}
              >Send</Button>
            </Box>
          </Stack>
          </form>
        </Card>
        ) : null
      }
      <DeleteReportDialog
        id={reportId}
        onClose={onClose}
        isOpen={isOpen}
        onSuccess={() => history.back()}
      />
      <Snackbar
        open={displaySendAlert.isOpen}
        autoHideDuration={5000}
        onClose={() => setDisplaySendAlert({ isOpen: false, status: '', message: ''})}
      >
        <Alert
          variant="outlined"
          severity={displaySendAlert.status as "success" | "error"}
          sx={{ bgcolor: 'background.paper' }}
          onClose={() => setDisplaySendAlert({ isOpen: false, status: '', message: '' })}
          >
            {displaySendAlert.message}
          </Alert>
      </Snackbar>
    </Stack>
  );
}
