import { Route } from '@tanstack/react-router';
import { rootRoute } from '../../App';

// export function Admin() {
//   return (
//     <Container maxW="container.xl">
//       <Routes>
//         <Route path="redis" element={<Redis />} />
//         <Route path="users" element={<Users />} />
//         <Route path="users/domain*" element={<UsersByDomain />} />
//         <Route path="leaderboards" element={<Leaderboards />} />
//         <Route path="beepers" element={<Beepers />} />
//         <Route path="beeps" element={<Beeps />} />
//         <Route path="cars" element={<Cars />} />
//         <Route path="feedback" element={<Feedback />} />
//         <Route path="payments" element={<Payments />} />
//         <Route path="beeps/active" element={<ActiveBeeps />} />
//         <Route path="beeps/:id" element={<Beep />} />
//         <Route path="users/:id/edit" element={<Edit />} />
//         <Route path="users/:id/:tab" element={<User />} />
//         <Route path="users/:id" element={<User />} />
//         <Route path="reports" element={<Reports />} />
//         <Route path="reports/:id" element={<Report />} />
//         <Route path="ratings" element={<Ratings />} />
//         <Route path="ratings/:id" element={<Rating />} />
//         <Route path="notifications" element={<Notifications />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Container>
//   );
// }

export const adminRoute = new Route({
  path: 'admin',
  getParentRoute: () => rootRoute,
});