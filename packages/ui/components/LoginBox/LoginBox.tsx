import { FunctionComponent, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import logo from "../../assets/tella-logo.png";
import Img from "next/image";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

type Credential = {
  username: string;
  password: string;
};

type Props = {
  onSubmit: (credential: Credential) => void;
  errorMessage?: string;
  isLoading?: boolean;
};

export const LoginBox: FunctionComponent<Props> = ({
  onSubmit,
  errorMessage,
  isLoading,
}) => {
  const [credentail, setCredentail] = useState<Credential>({
    username: "",
    password: "",
  });

  const [showPass, handleShowPass] = useState<boolean>(false);
  const [showErrorMessage, handleShowError] = useState<boolean>(false);
  const [showValidations, handleShowValidations] = useState<boolean>(false)

  const testMail = () => {
    return /\S+@\S+\.\S+/.test(credentail.username);
  };

  const { t } = useTranslation("common");

  const canSubmit = () => {
    return !testMail() || credentail.password.length === 0 
  }

  useEffect(() => {
    handleShowError(true);
  }, [errorMessage]);

  return (
    <form
      className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md border"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(credentail);
      }}
    >
      <div className="flex justify-center items-center py-4">
        <Img src={logo} height="36px" alt="Tella logo" />
      </div>
      <p className="mb-5 text-xl text-gray-600 font-bold">Sign in</p>
      <input
        type="text"
        name="username"
        className="mb-5 w-80 focus:border-blue-700 rounded text-base p-2 border-2 outline-none"
        value={credentail.username}
        placeholder="Email"
        required
        onChange={(e) => {
          setCredentail({ ...credentail, username: e.target.value });
        }}
        onFocus={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleShowValidations(false)
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleShowValidations(true)
          }
        }}
      />
      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={credentail.password}
          name="password"
          className="mb-5 w-80 focus:border-blue-700 rounded text-base p-2 border-2 outline-none"
          placeholder="Password"
          required
          onChange={(e) => {
            setCredentail({ ...credentail, password: e.target.value });
          }}
        />
        <div
          className="absolute right-0 top-0 pr-2 cursor-pointer"
          style={{ paddingTop: "10px" }}
          onClick={() => {
            handleShowPass(!showPass);
          }}
        >
          {showPass ? (
            <AiFillEye color="#8B8E8F" />
          ) : (
            <AiFillEyeInvisible color="#8B8E8F" />
          )}
        </div>
      </div>
      <button
        className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-80 disabled:opacity-50"
        id="login"
        disabled={canSubmit() || isLoading}
        type={"submit"}
      >
        <span>{isLoading ? "Logging in..." : t("login.singup")}</span>
      </button>
      {errorMessage && showErrorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      )}


      { showValidations && !testMail() && (
        <div
          className="w-full p-2 mt-2 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          Please enter a valid email address
        </div>
      )}
    </form>
  );
};
