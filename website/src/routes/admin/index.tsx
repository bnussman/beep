import React from 'react';
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
import Locations from './locations';
import Rates from './rates';

function Admin() {

    let match = useRouteMatch();

    return (
        <div className="flex-row sm:flex">
            <div className="container w-4/5 mx-auto mb-4">
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

                    <Route exact path={`${match.path}/locations`}>
                        <Locations />
                    </Route>
                    <Route exact path={`${match.path}/rates`}>
                        <Rates />
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default Admin;
