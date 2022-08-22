import { FunctionComponent } from "react";
import { LoginBox } from "../../components/LoginBox/LoginBox";
import { Credential } from "../../domain/Credential";

type Props = {
  onSubmit: (credential: Credential) => void;
  errorMessage?: string;
  isLoading?: boolean;
};
export const LoginPage: FunctionComponent<React.PropsWithChildren<Props>> = ({
  onSubmit,
  errorMessage,
  isLoading,
}) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <LoginBox
        onSubmit={onSubmit}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
