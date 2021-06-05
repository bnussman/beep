import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import Beepers from './Beepers';
import Users from './users';
import User from './users/User';
import EditUserPage from './users/Edit';
import Reports from './reports';
import Report from './reports/Report';
import Beeps from './beeps';
import Beep from './beeps/Beep';
import Ratings from './ratings';
import Rating from './ratings/Rating';
import {Container} from "@chakra-ui/react";

function Admin() {

    let match = useRouteMatch();

    return (
        <Container maxW="container.xl">
        <Switch>
            <Route exact path={`${match.path}/users`}>
                <Users />
            </Route>

            <Route exact path={`${match.path}/beepers`}>
                <Beepers />
            </Route>

            <Route exact path={`${match.path}/beeps`}>
                <Beeps />
            </Route>

            <Route exact path={`${match.path}/beeps/:beepId`}>
                <Beep />
            </Route>

            <Route exact path={`${match.path}/users/:userId`}>
                <User />
            </Route>

            <Route exact path={`${match.path}/users/:userId/edit`}>
                <EditUserPage />
            </Route>

            <Route exact path={`${match.path}/reports`}>
                <Reports />
            </Route>

            <Route exact path={`${match.path}/reports/:reportId`}>
                <Report />
            </Route>

            <Route exact path={`${match.path}/ratings`}>
                <Ratings />
            </Route>

            <Route exact path={`${match.path}/ratings/:id`}>
                <Rating />
            </Route>
        </Switch>
        </Container>
    );
}

export default Admin;
