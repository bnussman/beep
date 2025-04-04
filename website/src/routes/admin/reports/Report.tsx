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
} from "@mui/material";
import { Error } from "../../../components/Error";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { createRoute, useRouter } from "@tanstack/react-router";
import { reportsRoute } from ".";
import { RouterInput, trpc } from "../../../utils/trpc";
import { Controller, useForm } from "react-hook-form";

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

  const onSubmit = (values: RouterInput["report"]["updateReport"]["data"]) => {
    updateReport({
      reportId,
      data: values,
    });
  };

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
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reported</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={report.reported.photo ?? undefined} />
              <Typography>
                {report.reported.first} {report.reported.last}
              </Typography>
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
      <DeleteReportDialog
        id={reportId}
        onClose={onClose}
        isOpen={isOpen}
        onSuccess={() => history.back()}
      />
    </Stack>
  );
}
