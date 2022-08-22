import { FunctionComponent } from "react";
import { User } from "../../../state/domain/user";

type Props = {
  user?: User;
};

export const UserBar: FunctionComponent<React.PropsWithChildren<Props>> = ({ user }) => {
  return (
    <div className="flex flex-1 flex-col justify-center overflow-y-scroll">
      {user && (
        <>
          <h3 className="font-sans font-weight py-4 text-base">
            {user.username}
          </h3>
          <div className=' text-base py-4'>
            <span className='text-gray-500'>Created at</span>
            <p className='text-base'>{ user.createdAt }</p>
          </div>
          <div>
            <span className='text-gray-500 text-base'>note</span>
            <p className='text-base'>{ user.note }</p>
          </div>
        </>
      )}
    </div>
  );
};
