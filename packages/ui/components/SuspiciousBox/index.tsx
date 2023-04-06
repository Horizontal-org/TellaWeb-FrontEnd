import Img from "next/image";
import logo from "../../assets/tella-logo.png";

const SuspiciousPage = () => {
  return (
    <div
      className="p-8 bg-white rounded flex justify-center items-center flex-col shadow-md border"
      style={{ width: 400 }}
    >
      <div className="flex justify-center items-center py-8">
        <Img src={logo} height="36px" alt="Tella logo" />
      </div>
      <p className="text-gray-600 text-center" >
        Your account has been flagged as suspicious, please check your email to unlock it
      </p>
    </div>
  );
};

export default SuspiciousPage;
