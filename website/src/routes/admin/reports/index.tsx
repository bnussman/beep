import React from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { Table, Tbody, Td } from '@chakra-ui/react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { adminRoute } from '..';
import { trpc } from '../../../utils/trpc';
import { PaginationFooter } from '../../../components/PaginationFooter';
import { IconButton, Menu, MenuItem, Paper, Stack, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TableCellUser } from '../../../components/TableCellUser';
import { TableEmpty } from '../../../components/TableEmpty';
import { TableError } from '../../../components/TableError';
import { TableLoading } from '../../../components/TableLoading';
import MenuIcon from '@mui/icons-material/Menu';

dayjs.extend(relativeTime);

export const reportsRoute = createRoute({
  path: 'reports',
  getParentRoute: () => adminRoute,
});

export const reportsListRoute = createRoute({
  component: Reports,
  path: "/",
  getParentRoute: () => reportsRoute,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
  }),
});

export function Reports() {
  const { page } = reportsListRoute.useSearch();
  const navigate = useNavigate({ from: reportsListRoute.id });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data, isLoading, error } = trpc.report.reports.useQuery({
    page,
  });

  const setCurrentPage = (e: React.ChangeEvent<unknown>, page: number) => {
    navigate({ search: { page } });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight="bold">Reports</Typography>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reporter</TableCell>
              <TableCell>Reported</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Handled</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <Tbody>
            {data?.results === 0 && <TableEmpty colSpan={5} />}
            {error && <TableError colSpan={5} error={error.message} />}
            {isLoading && <TableLoading colSpan={5} />}
            {data?.reports.map((report) => (
              <TableRow>
                <TableCellUser user={report.reporter} />
                <TableCellUser user={report.reported} />
                <TableCell>{report.reason}</TableCell>
                <TableCell>{dayjs().to(report.timestamp)}</TableCell>
                <TableCell>
                  <Indicator color={report.handled ? 'green' : 'red'} />
                </TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>Details</MenuItem>
                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <PaginationFooter
        results={data?.results}
        pageSize={data?.pageSize ?? 0}
        page={page}
        onChange={setCurrentPage}
      />
    </Stack>
  );
}
