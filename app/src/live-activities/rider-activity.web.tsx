import { LiveActivityFactory } from "expo-widgets";
import { RiderActivityProps } from "./rider-activity";

const RiderActivity = {
  getInstances: () => [],
  start: () => {
    return {
      addPushTokenListener: () => {},
      end: () => {},
    };
  },
  nativeLiveActivityFactory: null
};
 
export default RiderActivity 
