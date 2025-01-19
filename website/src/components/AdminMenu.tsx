import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  MenuGroup,
  MenuDivider,
  Icon,
} from "@chakra-ui/react"
import {
  LiaCarAltSolid,
  LiaCarSideSolid,
  LiaExclamationCircleSolid,
  LiaStar,
  LiaTaxiSolid,
  LiaUser,
  LiaUsersSolid,
  LiaMoneyBillAlt,
  LiaHeart,
  LiaEnvelope
} from "react-icons/lia";
import { DiRedis } from "react-icons/di";
import { AiOutlineNotification } from 'react-icons/ai'
import { VscFeedback } from 'react-icons/vsc'
import { MdAlternateEmail } from 'react-icons/md'
import { TbMapPins } from 'react-icons/tb'
import { Link } from "@tanstack/react-router";

export function AdminMenu() {
  return (
    <Menu>
      <Button as={MenuButton}>
        Admin
      </Button>
      <MenuList>
        <MenuGroup title='General'>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaUsersSolid} />} as={Link} to="/admin/leaderboards">
            Leaderboards
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaUser} />} as={Link} to="/admin/users">
            Users
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={MdAlternateEmail} />} as={Link} to="/admin/users/domain">
            Users by Domain
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaTaxiSolid} />}  as={Link} to="/admin/beepers">
            Beepers
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaCarAltSolid} />}  as={Link} to="/admin/beeps/active">
            Beeps in progress
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={TbMapPins} />} as={Link} to="/admin/beeps">
            Beeps
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaExclamationCircleSolid} />}  as={Link} to="/admin/reports">
            Reports
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaStar} />}  as={Link} to="/admin/ratings">
            Ratings
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaCarSideSolid} />}  as={Link} to="/admin/cars">
            Cars
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={AiOutlineNotification} />}  as={Link} to="/admin/notifications">
            Notifications
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={VscFeedback} />}  as={Link} to="/admin/feedback">
            Feedback
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaMoneyBillAlt} />}  as={Link} to="/admin/payments">
            Payments
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title='Technical'>
          <MenuItem icon={<Icon fontSize="2xl" as={DiRedis} />}  as={Link} to="/admin/redis">
            Redis
          </MenuItem>
          <MenuItem icon={<Icon fontSize="2xl" as={LiaHeart} />} as={Link} to="/admin/health">
            Health
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
