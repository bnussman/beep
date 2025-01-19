import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { beepsTableRoute } from "../components/BeepsTable";
import { carsTableRoute } from "../components/CarsTable";
import { paymentsTableRoute } from "../components/PaymentsTable";
import { queueRoute } from "../components/QueueTable";
import { ratingsTableRoute } from "../components/RatingsTable";
import { reportsTableRoute } from "../components/ReportsTable";
import { changePasswordRoute } from "../routes/ChangePassword";
import { deleteAccountRoute } from "../routes/DeleteAccount";
import { downloadRoute } from "../routes/Download";
import { editProfileRoute } from "../routes/EditProfile";
import { forgotPasswordRoute } from "../routes/ForgotPassword";
import { indexRoute } from "../routes/Home";
import { loginRoute } from "../routes/Login";
import { privacyRoute } from "../routes/Privacy";
import { resetPasswordRoute } from "../routes/ResetPassword";
import { signupRoute } from "../routes/SignUp";
import { verifyAccountRoute } from "../routes/VerifyAccount";
import { adminRoute } from "../routes/admin";
import { feedbackRoute } from "../routes/admin/Feedback";
import { paymentsRoute } from "../routes/admin/Payments";
import { redisRoute } from "../routes/admin/Redis";
import { usersByDomainRoute } from "../routes/admin/UsersByDomain";
import { beepersRoute } from "../routes/admin/beepers/Beepers";
import { beepsRoute, beepsListRoute } from "../routes/admin/beeps";
import { activeBeepsRoute } from "../routes/admin/beeps/ActiveBeeps";
import { beepRoute } from "../routes/admin/beeps/Beep";
import { carsRoute } from "../routes/admin/cars";
import { leaderboardsRoute } from "../routes/admin/leaderboards";
import { notificationsRoute } from "../routes/admin/notifications";
import { ratingsRoute, ratingsListRoute } from "../routes/admin/ratings";
import { ratingRoute } from "../routes/admin/ratings/Rating";
import { reportsRoute, reportsListRoute } from "../routes/admin/reports";
import { reportRoute } from "../routes/admin/reports/Report";
import { usersRoute, usersListRoute } from "../routes/admin/users";
import { userDetailsRoute, userDetailsInitalRoute } from "../routes/admin/users/Details";
import { locationRoute } from "../routes/admin/users/Location";
import { userRoute } from "../routes/admin/users/User";
import { editUserRoute } from "../routes/admin/users/edit";
import { NotFound } from "../components/NotFound";
import { Beep } from "../App";
import { healthRoute } from "../routes/admin/Health";
import { duplicateRoute } from "../routes/admin/UsersWithDuplicateEmail";

export const rootRoute = createRootRoute({
  component: Beep,
});

export const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
}).lazy(() => import('../routes/Terms').then(r => r.termsRoute))


export const routeTree = rootRoute.addChildren([
  indexRoute,
  downloadRoute,
  editProfileRoute,
  deleteAccountRoute,
  changePasswordRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  privacyRoute,
  termsRoute,
  verifyAccountRoute,
  resetPasswordRoute,
  adminRoute.addChildren([
    leaderboardsRoute,
    usersByDomainRoute,
    beepersRoute,
    activeBeepsRoute,
    carsRoute,
    notificationsRoute,
    feedbackRoute,
    paymentsRoute,
    redisRoute,
    duplicateRoute,
    healthRoute,
    ratingsRoute.addChildren([
      ratingsListRoute,
      ratingRoute
    ]),
    reportsRoute.addChildren([
      reportsListRoute,
      reportRoute,
    ]),
    beepsRoute.addChildren([
      beepsListRoute,
      beepRoute,
    ]),
    usersRoute.addChildren([
      usersListRoute,
      usersByDomainRoute,
      userRoute.addChildren([
        userDetailsInitalRoute,
        userDetailsRoute,
        editUserRoute,
        locationRoute,
        queueRoute,
        beepsTableRoute,
        reportsTableRoute,
        ratingsTableRoute,
        carsTableRoute,
        paymentsTableRoute,
      ])
    ]),
  ]),
]);

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
