import React from "react";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { createRoute, useRouter } from "@tanstack/react-router";
import { reportsRoute } from ".";
import { RouterInput, useTRPC } from "../../../utils/trpc";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Typography,
  Stack,
  Avatar,
  Card,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Link } from "../../../components/Link";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const reportRoute = createRoute({
  component: Report,
  path: "$reportId",
  getParentRoute: () => reportsRoute,
});

export function Report() {
  const trpc = useTRPC();
  const { reportId } = reportRoute.useParams();
  const { history } = useRouter();
  const queryClient = useQueryClient();

  const {
    data: report,
    isLoading,
    error,
  } = useQuery(trpc.report.report.queryOptions(reportId));

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError,
  } = useMutation(trpc.report.updateReport.mutationOptions({
    onSuccess(report) {
      queryClient.invalidateQueries(trpc.report.report.invalidate(reportId));
      queryClient.invalidateQueries(trpc.report.reports.pathFilter());
    },
  }));

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
    return <Alert severity="error">{error.message}</Alert>;
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
      <Card sx={{ p: 2, pt: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            Details
          </Typography>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reporter</Typography>
            <Link to="/admin/users/$userId" params={{ userId: report.reporter_id }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={report.reporter.photo ?? undefined} />
                <Typography>
                  {report.reporter.first} {report.reporter.last}
                </Typography>
              </Stack>
            </Link>
          </Stack>
          <Stack spacing={1}>
            <Typography fontWeight="bold">Reported</Typography>
            <Link to="/admin/users/$userId" params={{ userId: report.reported_id }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={report.reported.photo ?? undefined} />
                <Typography>
                  {report.reported.first} {report.reported.last}
                </Typography>
              </Stack>
            </Link>
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
      <Card sx={{ p: 2 }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Typography variant="h5" fontWeight="bold">
                Admin Notes
              </Typography>
              {report.handledBy && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight="bold">Resolved By</Typography>
                  <Avatar
                    src={report.handledBy.photo ?? undefined}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography>
                    {report.handledBy.first} {report.handledBy.last}
                  </Typography>
                </Stack>
              )}
            </Stack>
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
                    label="Resolved"
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
