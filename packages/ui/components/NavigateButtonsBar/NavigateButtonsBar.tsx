import { FunctionComponent, PropsWithChildren } from "react";
import { MdNavigateBefore } from "@react-icons/all-files/md/MdNavigateBefore";
import { MdNavigateNext } from "@react-icons/all-files/md/MdNavigateNext";
import { btnType, Button } from "../Button/Button";

type Props = {
  goPrev: () => void;
  goNext: () => void;
};

export const NavigateButtonsBar: FunctionComponent<
  PropsWithChildren<Props>
> = ({ goPrev, goNext, children }) => (
  <div id="navigate-bar" className="flex px-4">
    <Button
      text="Back"
      icon={<MdNavigateBefore />}
      type={btnType.Primary}
      onClick={goPrev}
    />

    <div className="flex-1 flex justify-between">{children}</div>

    <Button
      text="Next"
      icon={<MdNavigateNext />}
      type={btnType.Primary}
      onClick={goNext}
    />
  </div>
);
