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
import { Redis } from './Redis';
import { Feedback } from './Feedback';
import { Cars } from './cars';
import { Leaderboards } from './leaderboards';
import { UsersByDomain } from './UsersByDomain';
import { NotFound } from '../../components/NotFound';
import { Payments } from './Payments';

export function Admin() {
  return (
    <Container maxW="container.xl">
      <Routes>
        <Route path="redis" element={<Redis />} />
        <Route path="users" element={<Users />} />
        <Route path="users/domain*" element={<UsersByDomain />} />
        <Route path="leaderboards" element={<Leaderboards />} />
        <Route path="beepers" element={<Beepers />} />
        <Route path="beeps" element={<Beeps />} />
        <Route path="cars" element={<Cars />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="payments" element={<Payments />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
}
