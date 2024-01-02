import { FunctionComponent } from "react";
import { Resource } from "../../../state/domain/resource";
import { format } from "date-fns";

type Props = {
  resource?: Resource;
};

export const ResourceBar: FunctionComponent<React.PropsWithChildren<Props>> = ({ resource }) => {
  return (
    <div className="flex flex-1 flex-col justify-center overflow-y-scroll">
      {resource && (
        <>
          <h3 className="font-sans font-weight py-4 text-lg text-gray-500">
            {resource.title}
          </h3>
          <div className='py-4'>
            <span className='text-gray-500 text-base'>Info</span>
            <div className="flex w-full justify-between py-2">
              <span className="text-sm text-gray-500">Created</span>
              <span className='text-sm'>{ format(new Date(resource.createdAt), "dd MMM yyyy") }</span>
            </div>

            <div className="flex w-full justify-between py-2">
              <span className="text-sm text-gray-500">Size</span>
              <span className='text-sm'>{ resource.size && `${(parseInt(resource.size) / 1024).toFixed(2)} kb` }</span>
            </div>
          </div>
          <div>
            <span className='text-gray-500 text-base '>Used in the following projects</span>
            { resource.projects.map((p) => (
              <p className="text-sm py-2">
                { p.name }
              </p>
            ))}

            { resource.projects.length === 0 && (
              <p className="text-base py-2">None</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
