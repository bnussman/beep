import { beepsTableRoute } from "../components/BeepsTable";
import { carsTableRoute } from "../components/CarsTable";
import { paymentsTableRoute } from "../components/PaymentsTable";
import { queueRoute } from "../components/QueueTable";
import { ratingsTableRoute } from "../components/RatingsTable";
import { reportsTableRoute } from "../components/ReportsTable";
import { adminRoute } from "../routes/admin";
import { beepersRoute } from "../routes/admin/beepers/Beepers";
import { beepsRoute, beepsListRoute } from "../routes/admin/beeps";
import { activeBeepsRoute } from "../routes/admin/beeps/ActiveBeeps";
import { beepRoute } from "../routes/admin/beeps/Beep";
import { carsRoute } from "../routes/admin/cars";
import { feedbackRoute } from "../routes/admin/feedback/Feedback";
import { healthRoute } from "../routes/admin/Health";
import { leaderboardsRoute } from "../routes/admin/leaderboards";
import { beepsLeaderboard } from "../routes/admin/leaderboards/beeps";
import { ridesLeaderboard } from "../routes/admin/leaderboards/rides";
import { notificationsRoute } from "../routes/admin/notifications";
import { paymentsRoute } from "../routes/admin/Payments";
import { ratingsRoute, ratingsListRoute } from "../routes/admin/ratings";
import { ratingRoute } from "../routes/admin/ratings/Rating";
import { redisRoute } from "../routes/admin/Redis";
import { reportsRoute, reportsListRoute } from "../routes/admin/reports";
import { reportRoute } from "../routes/admin/reports/Report";
import { usersListRoute } from "../routes/admin/users";
import { userDetailsRoute } from "../routes/admin/users/Details";
import { editUserRoute } from "../routes/admin/users/edit";
import { userDetailsInitalRoute } from "../routes/admin/users/IndexTab";
import { locationRoute } from "../routes/admin/users/Location";
import { rideRoute } from "../routes/admin/users/Ride";
import { usersRoute } from "../routes/admin/users/routes";
import { userRoute } from "../routes/admin/users/User";
import { usersByDomainRoute } from "../routes/admin/UsersByDomain";
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
import { termsRoute } from "../routes/Terms";
import { verifyAccountRoute } from "../routes/VerifyAccount";
import { rootRoute } from "./root";

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
    leaderboardsRoute.addChildren([beepsLeaderboard, ridesLeaderboard]),
    usersByDomainRoute,
    beepersRoute,
    activeBeepsRoute,
    carsRoute,
    notificationsRoute,
    feedbackRoute,
    paymentsRoute,
    redisRoute,
    healthRoute,
    ratingsRoute.addChildren([ratingsListRoute, ratingRoute]),
    reportsRoute.addChildren([reportsListRoute, reportRoute]),
    beepsRoute.addChildren([beepsListRoute, beepRoute]),
    usersRoute.addChildren([
      usersListRoute,
      usersByDomainRoute,
      userRoute.addChildren([
        userDetailsInitalRoute,
        rideRoute,
        userDetailsRoute,
        editUserRoute,
        locationRoute,
        queueRoute,
        beepsTableRoute,
        reportsTableRoute,
        ratingsTableRoute,
        carsTableRoute,
        paymentsTableRoute,
      ]),
    ]),
  ]),
]);
