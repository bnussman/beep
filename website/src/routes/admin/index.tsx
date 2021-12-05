import {
    Route,
    useMatch,
    Routes
} from "react-router-dom";
import Beepers from './beepers/Beepers';
import Users from './users';
import User from './users/User';
import EditUserPage from './users/Edit';
import React from 'react';
import Reports from './reports';
import Report from './reports/Report';
import Beeps from './beeps';
import Beep from './beeps/Beep';
import Ratings from './ratings';
import Rating from './ratings/Rating';
import { Container } from "@chakra-ui/react";
import ActiveBeeps from "./beeps/ActiveBeeps";

function Admin() {
  return (
    <Container maxW="container.xl">
      <Routes>
        <Route path={`users`} element={<Users />} />
        <Route path={`beepers`} element={<Beepers />} />
        <Route path={`beeps`} element={<Beeps />} />
        <Route path={`beeps/active`} element={<ActiveBeeps />} />
        <Route path={`beeps/:id`} element={<Beep />} />
        <Route path={`users/:id/edit`} element={<EditUserPage />} />
        <Route path={`users/:id/:tab`} element={<User />} />
        <Route path={`users/:id`} element={<User />} />
        <Route path={`reports`} element={<Reports />} />
        <Route path={`reports/:id`} element={<Report />} />
        <Route path={`ratings`} element={<Ratings />} />
        <Route path={`ratings/:id`} element={<Rating />} />
      </Routes>
    </Container>
  );
}

export default Admin;
