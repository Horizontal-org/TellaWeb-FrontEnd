import { FunctionComponent } from "react";

import { SettingsButton } from "../SettingsButton/SettingsButton";
import { NavigateButtonsBar } from "../NavigateButtonsBar/NavigateButtonsBar";
import {
  CamouflageChoice,
  CamouflageConfig,
  Configuration,
} from "../../domain/Configuration";
import { useToggleOptions } from "../../hooks/useToggleOptions";

type Props = {
  config: Configuration;
  goPrev: () => void;
  goNext: (camouflage: CamouflageConfig) => void;
};

export const CamouflageWizard: FunctionComponent<Props> = ({
  config,
  goPrev,
  goNext,
}) => {
  const [options, toggleOptions] = useToggleOptions<CamouflageChoice>(
    config.camouflage
  );

  return (
    <div className="block w-auto">
      <p className="text-xxxl font-extrablack text-black justify-center items-center text-center p-xxxsm mt-xxxxl">
        Camouflage
      </p>
      <p className="text-base font-medium text-grey-500 justify-center items-center text-center mb-xxl">
        What camouflage option(s) should be available to users?
      </p>
      <div className="flex flex-row justify-center gap-10">
        <SettingsButton
          onClick={toggleOptions(CamouflageChoice.ICON)}
          selected={options[CamouflageChoice.ICON] || false}
          type="Icon"
          description="The user picks a new name and icon"
        />
        <SettingsButton
          onClick={toggleOptions(CamouflageChoice.CALCULATOR)}
          selected={options[CamouflageChoice.CALCULATOR] || false}
          type="Calculator"
          description="The user enters their pin in a calculator"
        />
        <SettingsButton
          onClick={toggleOptions(CamouflageChoice.NOTEPAD)}
          selected={options[CamouflageChoice.NOTEPAD] || false}
          type="Notepad"
          description="The user enters 6 or more letters or numbers"
        />
      </div>
      <p className="text-base font-medium text-grey-500 justify-center items-center text-center mt-xxxxl">
        {" "}
        Select at least one option above.
      </p>
      <NavigateButtonsBar goPrev={goPrev} goNext={() => goNext(options)} />
    </div>
  );
};
