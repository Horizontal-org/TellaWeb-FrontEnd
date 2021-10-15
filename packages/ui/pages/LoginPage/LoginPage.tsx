import { FunctionComponent } from "react";
import { LoginBox } from "../../components/LoginBox/LoginBox";
import { Credential } from "../../domain/Credential";

type Props = {
  onSubmit: (credential: Credential) => void;
  errorMessage?: string;
};
export const LoginPage: FunctionComponent<Props> = ({
  onSubmit,
  errorMessage,
}) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <LoginBox onSubmit={onSubmit} errorMessage={errorMessage} />
    </div>
  );
};
