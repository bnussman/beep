# Admin Routes Quick Reference

## URL to File Mapping

| URL Path | File Path |
|----------|-----------|
| `/admin/health` | `app/routes/admin.health.tsx` |
| `/admin/redis` | `app/routes/admin.redis.tsx` |
| `/admin/payments` | `app/routes/admin.payments.tsx` |
| `/admin/notifications` | `app/routes/admin.notifications.tsx` |
| `/admin/beepers` | `app/routes/admin.beepers.tsx` |
| `/admin/cars` | `app/routes/admin.cars.tsx` |
| `/admin/feedback` | `app/routes/admin.feedback.tsx` |
| `/admin/beeps` | `app/routes/admin.beeps/index.tsx` |
| `/admin/beeps/active` | `app/routes/admin.beeps/active.tsx` |
| `/admin/beeps/:beepId` | `app/routes/admin.beeps/$beepId.tsx` |
| `/admin/leaderboards` | `app/routes/admin.leaderboards.tsx` |
| `/admin/leaderboards/beeps` | `app/routes/admin.leaderboards/beeps.tsx` |
| `/admin/leaderboards/rides` | `app/routes/admin.leaderboards/rides.tsx` |
| `/admin/ratings` | `app/routes/admin.ratings/index.tsx` |
| `/admin/ratings/:ratingId` | `app/routes/admin.ratings/$ratingId.tsx` |
| `/admin/reports` | `app/routes/admin.reports/index.tsx` |
| `/admin/reports/:reportId` | `app/routes/admin.reports/$reportId.tsx` |
| `/admin/users` | `app/routes/admin.users/index.tsx` |
| `/admin/users/domain` | `app/routes/admin.users/domain.tsx` |
| `/admin/users/:userId` | `app/routes/admin.users/$userId.tsx` (layout) |
| `/admin/users/:userId/details` | `app/routes/admin.users/$userId.details.tsx` |
| `/admin/users/:userId/location` | `app/routes/admin.users/$userId.location.tsx` |
| `/admin/users/:userId/edit` | `app/routes/admin.users/$userId.edit.tsx` |

## Common Patterns

### Creating a File-Based Route
```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute("/admin/health")({
  component: Health,
});
```

### With Search Params
```tsx
export const Route = createFileRoute("/admin/users/")({
  component: Users,
  validateSearch: (search: Record<string, string>) => ({
    page: Number(search?.page ?? 1),
    query: search.query ? search.query : undefined,
  }),
});
```

### Using Route Hooks
```tsx
function MyComponent() {
  const { page } = Route.useSearch();
  const { userId } = Route.useParams();
  const navigate = useNavigate({ from: Route.id });
}
```

### Layout Route with Outlet
```tsx
export const Route = createFileRoute("/admin/users/$userId")({
  component: UserLayout,
});

function UserLayout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

## Import Patterns

### Components from src
```tsx
import { Loading } from "../../src/components/Loading";
import { useTRPC } from "../../src/utils/trpc";
```

### Dialog/Menu Components (Still in old location)
```tsx
import { DeleteBeepDialog } from "../../../src/routes/admin/beeps/DeleteBeepDialog";
import { BeepMenu } from "../../../src/routes/admin/beeps/BeepMenu";
```

## File Naming Conventions

- **Dot notation**: `admin.health.tsx` → `/admin/health`
- **Directory**: `admin.beeps/index.tsx` → `/admin/beeps`
- **Dynamic param**: `$userId.tsx` → `/:userId`
- **Nested dynamic**: `$userId.details.tsx` → `/:userId/details`
- **Index file**: `index.tsx` → `/` (within parent)

## Testing Checklist

- [ ] `/admin/health` - Health check page
- [ ] `/admin/redis` - Redis channels
- [ ] `/admin/beepers` - Active beepers list
- [ ] `/admin/beeps` - All beeps list
- [ ] `/admin/beeps/active` - Active beeps
- [ ] `/admin/beeps/[id]` - Beep detail
- [ ] `/admin/leaderboards/beeps` - Beeps leaderboard
- [ ] `/admin/leaderboards/rides` - Rides leaderboard
- [ ] `/admin/ratings` - Ratings list
- [ ] `/admin/ratings/[id]` - Rating detail
- [ ] `/admin/reports` - Reports list
- [ ] `/admin/reports/[id]` - Report detail
- [ ] `/admin/users` - Users list (with search)
- [ ] `/admin/users/domain` - Users by domain
- [ ] `/admin/users/[id]/details` - User details
- [ ] `/admin/users/[id]/location` - User location
- [ ] `/admin/users/[id]/edit` - Edit user
- [ ] `/admin/cars` - Cars list
- [ ] `/admin/feedback` - Feedback list
- [ ] `/admin/notifications` - Send notifications
- [ ] `/admin/payments` - Payments list

