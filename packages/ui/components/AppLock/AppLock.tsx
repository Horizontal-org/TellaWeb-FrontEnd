import { FunctionComponent } from "react";

import { SettingsButton } from "../SettingsButton/SettingsButton";
import { NavigateButtonsBar } from "../NavigateButtonsBar/NavigateButtonsBar";
import {
  AppLockChoice,
  AppLockConfig,
  Configuration,
} from "../../domain/Configuration";
import { useToggleOptions } from "../../hooks/useToggleOptions";

type Props = {
  config?: Configuration;
  goPrev: () => void;
  goNext: (selected: AppLockConfig) => void;
};

export const AppLock: FunctionComponent<Props> = ({
  config,
  goPrev,
  goNext,
}) => {
  const [options, toggleOptions] = useToggleOptions<AppLockChoice>(
    config.applock
  );

  return (
    <div className="block w-auto">
      <p className="text-xxxl font-extrablack text-black justify-center items-center text-center p-xxxsm mt-xxxxl">
        App Lock
      </p>
      <p className="text-base font-medium text-grey-500 justify-center items-center text-center mb-xxl">
        {" "}
        What lock(s) should be available to users?{" "}
      </p>
      <div className="flex flex-row justify-center gap-10">
        <SettingsButton
          onClick={toggleOptions(AppLockChoice.PATTERN)}
          selected={options[AppLockChoice.PATTERN]}
          type="Pattern"
          description="Draw a simple pattern with your finger"
        />
        <SettingsButton
          onClick={toggleOptions(AppLockChoice.PIN)}
          selected={options[AppLockChoice.PIN]}
          type="Pin"
          description="The user enters 6 or more numbers"
        />
        <SettingsButton
          onClick={toggleOptions(AppLockChoice.PASSWORD)}
          selected={options[AppLockChoice.PASSWORD]}
          type="Password"
          description="The user enters 6 or more letters or numbers"
        />
      </div>
      <p className="text-base font-medium text-grey-500 justify-center items-center text-center mt-xxxxl">
        {" "}
        The user will be able to set a Pattern or a PIN as their app lock.
      </p>
      <NavigateButtonsBar goPrev={goPrev} goNext={() => goNext(options)} />
    </div>
  );
};
