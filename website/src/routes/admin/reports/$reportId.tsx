import React from "react";
import { RouterInputs } from "../../../../../api/src";
import { orpc } from "../../../utils/orpc";
import { Link } from "../../../components/Link";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "../../../components/DeleteReportDialog";
import { useRouter, createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
  Typography,
} from "@heroui/react";

export const Route = createFileRoute('/admin/reports/$reportId')({
  component: Report,
});

function Report() {
  const { reportId } = Route.useParams();
  const { history } = useRouter();
  const queryClient = useQueryClient();

  const {
    data: report,
    isLoading,
    error,
  } = useQuery(orpc.report.report.queryOptions({ input: reportId }));

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError,
  } = useMutation(orpc.report.updateReport.mutationOptions({
    onSuccess(report) {
      queryClient.invalidateQueries(orpc.report.report.queryOptions({ input: reportId }));
      queryClient.invalidateQueries({
        queryKey: orpc.report.reports.key()
      });
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

  const onSubmit = (values: RouterInputs["report"]["updateReport"]["data"]) => {
    updateReport({
      reportId,
      data: values,
    });
  };

  if (isLoading || !report) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Typography type="h1">
          Report
        </Typography>
        <Button variant="danger" onPress={() => setIsOpen(true)}>
          Delete
        </Button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-separator bg-surface p-4">
        <div className="flex flex-col gap-4">
          <Typography type="h2">
            Details
          </Typography>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Reporter</Typography>
            <Link to="/admin/users/$userId" params={{ userId: report.reporter.id }}>
              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image alt={`${report.reporter.first} ${report.reporter.last}`} src={report.reporter.photo ?? undefined} />
                  <Avatar.Fallback>{report.reporter.first.at(0)?.toUpperCase()}{report.reporter.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <Typography type="body">
                  {report.reporter.first} {report.reporter.last}
                </Typography>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Reported</Typography>
            <Link to="/admin/users/$userId" params={{ userId: report.reported.id }}>
              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image alt={`${report.reported.first} ${report.reported.last}`} src={report.reported.photo ?? undefined} />
                  <Avatar.Fallback>{report.reported.first.at(0)?.toUpperCase()}{report.reported.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <Typography type="body">
                  {report.reported.first} {report.reported.last}
                </Typography>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Reason</Typography>
            <Typography type="body">{report.reason}</Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Date</Typography>
            <Typography type="body">
              {new Date(report.timestamp).toLocaleString()}
            </Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Beep</Typography>
            <Typography type="body">
              {report.beep_id ? (
                <Link to="/admin/beeps/$beepId" params={{ beepId: report.beep_id }}>{report.beep_id}</Link>
              )
                : 'N/A'
              }
            </Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography type="body" className="font-bold">Rating</Typography>
            <Typography type="body">
              {report.rating_id ? (
                <Link to="/admin/ratings/$ratingId" params={{ ratingId: report.rating_id }}>{report.rating_id}</Link>
              )
                : 'N/A'
              }
            </Typography>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-separator bg-surface p-4">
        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap justify-between">
              <Typography type="h2">
                Admin Notes
              </Typography>
              {report.handledBy && (
                <div className="flex items-center gap-2">
                  <Typography type="body" className="font-bold">Resolved By</Typography>
                  <Avatar className="size-6">
                    <Avatar.Image
                      alt={`${report.handledBy.first} ${report.handledBy.last}`}
                      src={report.handledBy.photo ?? undefined}
                    />
                    <Avatar.Fallback>{report.handledBy.first.at(0)?.toUpperCase()}{report.handledBy.last.at(0)?.toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <Typography type="body">
                    {report.handledBy.first} {report.handledBy.last}
                  </Typography>
                </div>
              )}
            </div>
            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <TextField {...field} value={field.value ?? ""}>
                  <Label>Notes</Label>
                  <TextArea rows={4} />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
            <div className="flex flex-row justify-between">
              <Controller
                control={form.control}
                name="handled"
                render={({ field }) => (
                  <Checkbox
                    isSelected={field.value ?? false}
                    onChange={field.onChange}
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      Resolved
                    </Checkbox.Content>
                  </Checkbox>
                )}
              />
              <Button
                isDisabled={!form.formState.isDirty}
                type="submit"
                isPending={isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <DeleteReportDialog
        id={reportId}
        onClose={onClose}
        isOpen={isOpen}
        onSuccess={() => history.back()}
      />
    </div>
  );
}
