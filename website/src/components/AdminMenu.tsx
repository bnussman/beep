import React from "react";
import { Button, Dropdown, Label, Separator } from "@heroui/react";
import { createLink } from "@tanstack/react-router";

const RouterMenuItem = createLink(Dropdown.Item);

export function AdminMenu() {
  return (
    <Dropdown>
      <Button variant="tertiary">
        Admin
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <RouterMenuItem
            id="users"
            textValue="Users"
            to="/admin/users"
            search={{ page: 1 }}
          >
            <Label>Users</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="users-by-domain"
            textValue="Users by Domain"
            to="/admin/users/domain"
          >
            <Label>Users by Domain</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="leaderboards"
            textValue="Leaderboards"
            to="/admin/leaderboards/$"
            search={{ page: 1 }}
          >
            <Label>Leaderboards</Label>
          </RouterMenuItem>
          <RouterMenuItem id="beepers" textValue="Beepers" to="/admin/beepers">
            <Label>Beepers</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="active-beeps"
            textValue="Beeps in progress"
            to="/admin/beeps/active"
            search={{ page: 1 }}
          >
            <Label>Beeps in progress</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="beeps"
            textValue="Beeps"
            to="/admin/beeps"
            search={{ page: 1 }}
          >
            <Label>Beeps</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="reports"
            textValue="Reports"
            to="/admin/reports"
            search={{ page: 1 }}
          >
            <Label>Reports</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="ratings"
            textValue="Ratings"
            to="/admin/ratings"
            search={{ page: 1 }}
          >
            <Label>Ratings</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="cars"
            textValue="Cars"
            to="/admin/cars"
            search={{ page: 1 }}
          >
            <Label>Cars</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="notifications"
            textValue="Notifications"
            to="/admin/notifications"
          >
            <Label>Notifications</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="feedback"
            textValue="Feedback"
            to="/admin/feedback"
            search={{ page: 1 }}
          >
            <Label>Feedback</Label>
          </RouterMenuItem>
          <RouterMenuItem
            id="payments"
            textValue="Payments"
            to="/admin/payments"
            search={{ page: 1 }}
          >
            <Label>Payments</Label>
          </RouterMenuItem>
          <RouterMenuItem id="redis" textValue="Redis" to="/admin/redis">
            <Label>Redis</Label>
          </RouterMenuItem>
          <RouterMenuItem id="health" textValue="Health" to="/admin/health">
            <Label>Health</Label>
          </RouterMenuItem>
          <Separator />
          <Dropdown.Item
            id="osrm"
            textValue="OSRM"
            href="https://osrm.ridebeep.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>OSRM</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="grafana"
            textValue="Grafana"
            href="https://grafana.ridebeep.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>Grafana</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="sentry"
            textValue="Sentry"
            href="https://ian-banks-llc.sentry.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>Sentry</Label>
          </Dropdown.Item>
          <Separator />
          <Dropdown.Item
            id="email"
            textValue="Email"
            href="https://mail.ridebeep.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>Email</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="calendar"
            textValue="Calendar"
            href="https://calendar.ridebeep.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>Calendar</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="drive"
            textValue="Drive"
            href="https://drive.ridebeep.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Label>Drive</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
