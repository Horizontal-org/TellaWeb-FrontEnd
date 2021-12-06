import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation("login");

  return (
    <form
      className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(credentail);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 text-gray-600 mb-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
          clipRule="evenodd"
        />
      </svg>
      <p className="mb-5 text-3xl uppercase text-gray-600">{t("title")}</p>
      <input
        type="text"
        name="username"
        className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
        value={credentail.username}
        placeholder={t("username")}
        onChange={(e) => {
          setCredentail({ ...credentail, username: e.target.value });
        }}
        required
      />
      <input
        type="password"
        value={credentail.password}
        name="password"
        className="mb-5 p-3 w-80 focus:border-blue-700 rounded border-2 outline-none"
        placeholder={t("password")}
        onChange={(e) => {
          setCredentail({ ...credentail, password: e.target.value });
        }}
        required
      />
      <button
        className="bg-blue-600 hover:bg-blue text-white font-bold p-2 rounded w-80"
        id="login"
        type={"submit"}
      >
        <span>{t("login.btn")}</span>
      </button>
      {errorMessage && (
        <div
          className="w-full p-2 mt-4 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {t(errorMessage)}
        </div>
      )}
    </form>
  );
};
