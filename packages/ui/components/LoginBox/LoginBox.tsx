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
};

export const LoginBox: FunctionComponent<Props> = ({
  onSubmit,
  errorMessage,
}) => {
  const [credentail, setCredentail] = useState<Credential>({
    username: "",
    password: "",
  });
  const [message, handleMessage] = useState<string>("");
  const [canSubmit, handleCanSubmit] = useState<boolean>(false);
  const [showPass, handleShowPass] = useState<boolean>(false);
  const { t } = useTranslation("login");

  useEffect(() => {
    if (message.length > 0) {
      handleMessage("");
    }

    const auxCanSubmit =
      credentail.username.length > 0 && credentail.password.length > 0;
    if (auxCanSubmit !== canSubmit) {
      handleCanSubmit(auxCanSubmit);
    }
  }, [credentail]);

  const testMail = () => {
    // const expression = ""
    return /\S+@\S+\.\S+/.test(credentail.username);
  };

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
      <p className="mb-5 text-xl text-gray-600 font-bold">{t("title")}</p>
      <input
        type="text"
        name="username"
        className="mb-5 w-80 focus:border-blue-700 rounded text-base p-2 border-2 outline-none"
        value={credentail.username}
        placeholder={t("email")}
        required
        onChange={(e) => {
          setCredentail({ ...credentail, username: e.target.value });
        }}
      />
      <div className="relative">
        <input
          type={showPass ? "text" : "password"}
          value={credentail.password}
          name="password"
          className="mb-5 w-80 focus:border-blue-700 rounded text-base p-2 border-2 outline-none"
          placeholder={t("password")}
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
        disabled={!canSubmit}
        type={"submit"}
      >
        <span>{t("login.btn")}</span>
      </button>
      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
      {!testMail() && (
        <div
          className="w-full p-2 mt-2 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {t("error.email")}
        </div>
      )}
    </form>
  );
};
