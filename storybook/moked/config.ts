import {
  AppLockChoice,
  Configuration,
} from "../../packages/ui/domain/Configuration";

export const FakeConfig: Configuration = {
  title: "Election 2020",
  id: "87nkjn-239jkn-2398nl",
  status: "Draft",
  connections: 0,
  date: 1609864249034,
  applock: {
    [AppLockChoice.PASSWORD]: true,
  },
  camouflage: {},
};
