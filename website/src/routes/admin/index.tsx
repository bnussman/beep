import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { Edit } from "./users/edit";
import { Beepers } from './beepers/Beepers';
import { Users } from './users';
import { User } from './users/User';
import { Reports } from './reports';
import { Report } from './reports/Report';
import { Beeps } from './beeps';
import { Beep } from './beeps/Beep';
import { Ratings } from './ratings';
import { Rating } from './ratings/Rating';
import { ActiveBeeps } from "./beeps/ActiveBeeps";
import { Notifications } from "./notifications";
import { Dashboard } from './Dashboard';

export function Admin() {
  return (
    <Container maxW="container.xl">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="beepers" element={<Beepers />} />
        <Route path="beeps" element={<Beeps />} />
        <Route path="beeps/active" element={<ActiveBeeps />} />
        <Route path="beeps/:id" element={<Beep />} />
        <Route path="users/:id/edit" element={<Edit />} />
        <Route path="users/:id/:tab" element={<User />} />
        <Route path="users/:id" element={<User />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<Report />} />
        <Route path="ratings" element={<Ratings />} />
        <Route path="ratings/:id" element={<Rating />} />
        <Route path="notifications" element={<Notifications />} />
      </Routes>
    </Container>
  );
}
