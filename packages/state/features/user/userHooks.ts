import { RootStore } from "packages/state/store";
import { useSelector } from "react-redux";

export const useUserProfile = () => {
  const { user } = useSelector((store: RootStore) => store.user);
  return user;
};
