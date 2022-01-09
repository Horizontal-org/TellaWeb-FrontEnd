import { FunctionComponent, useState, useEffect } from "react";
import logo from '../../assets/tella-logo.png'
import Img from "next/image";
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'

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
  
  const [canSubmit, handleCanSubmit] = useState<boolean>(false)
  const [showPass, handleShowPass] = useState<boolean>(false)
  const [showErrorMessage, handleShowError] = useState<boolean>(false)

  const testMail = () => {
    return /\S+@\S+\.\S+/.test(credentail.username)
  }


  useEffect(() => {    
    const requiredFields = credentail.username.length > 0 && credentail.password.length > 0
    const emailValid = testMail()
    
    handleCanSubmit(requiredFields && emailValid)

    if (showErrorMessage) {
      handleShowError(false)
    }
  }, [credentail])

  useEffect(() => {
    handleShowError(true)
  }, [errorMessage])

  return (
    <form
      className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md border"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(credentail);
      }}
    >
      <div className='flex justify-center items-center py-4'>
        <Img src={logo} height="36px" alt="Tella logo"/>
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
      />
      <div className='relative'>
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
          className='absolute right-0 top-0 pr-2 cursor-pointer' 
          style={{paddingTop: '10px'}}
          onClick={() => {
            handleShowPass(!showPass)
          }}
        >
          { showPass ? (
            <AiFillEye color='#8B8E8F'/>
          ) : (
            <AiFillEyeInvisible color='#8B8E8F'/>
          )}
        </div>
      </div>
      <button
        className="bg-blue-300 hover:bg-blue py-2 text-white uppercase text-base font-bold rounded w-80 disabled:opacity-50"
        id="login"
        disabled={!canSubmit || isLoading}
        type={"submit"}
      >
        <span>{isLoading ? "Logging in..." : "Sign in"}</span>
      </button>
      {errorMessage && showErrorMessage && (
        <div
          className="w-full p-2 mt-4 mb-2 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
      { credentail.username.length > 0 && credentail.password.length > 0 && !testMail() &&
        <div
          className="w-full p-2 mt-2 mb-4 bg-red-100 text-center text-red-900 text-sm rounded-md border border-red-200"
          role="alert"
        >
          Please enter a valid email address
        </div>
      }
    </form>
  );
};
