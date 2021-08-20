import {
    Switch,
    Route,
    useRouteMatch
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
  const match = useRouteMatch();

  return (
    <Container maxW="container.xl">
      <Switch>
        <Route exact path={`${match.path}/users`} component={Users} />
        <Route exact path={`${match.path}/beepers`} component={Beepers} />
        <Route exact path={`${match.path}/beeps`} component={Beeps} />
        <Route exact path={`${match.path}/beeps/active`} component={ActiveBeeps} />
        <Route exact path={`${match.path}/beeps/:id`} component={Beep} />
        <Route exact path={`${match.path}/users/:id/edit`} component={EditUserPage} />
        <Route exact path={`${match.path}/users/:id/:tab`} component={User} />
        <Route exact path={`${match.path}/users/:id`} component={User} />
        <Route exact path={`${match.path}/reports`} component={Reports} />
        <Route exact path={`${match.path}/reports/:id`} component={Report} />
        <Route exact path={`${match.path}/ratings`} component={Ratings} />
        <Route exact path={`${match.path}/ratings/:id`} component={Rating} />
      </Switch>
    </Container>
  );
}

export default Admin;
