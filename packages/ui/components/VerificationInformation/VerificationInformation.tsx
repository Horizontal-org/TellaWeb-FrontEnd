import { FunctionComponent } from "react";
import VerificationMap from "../VerificationMap";

interface Props {
  deviceInfo: string;
  fileInfo: string;
}

export const VerificationInformation: FunctionComponent<React.PropsWithChildren<Props>> = ({
  deviceInfo,
  fileInfo
}) => {
  return (
    <div>
      <div className="text-base font-bold text-gray-500 py-3 text-center">
        Verification Information
      </div>

      { deviceInfo && (
        <div className="py-2">
          <VerificationMap 
            longitude={JSON.parse(deviceInfo).longitude}
            latitude={JSON.parse(deviceInfo).latitude}
          />
        </div>
      )}

      { fileInfo && (
        <div>        
          <h3 className="text-base font-bold text-gray-500 py-3">File</h3>
          { Object.entries(JSON.parse(fileInfo)).map(([key, value]: [string, string]) => (
            <div className="text-sm text-gray-500 gap-y-2">
              <div style={{padding: '2px 0'}} className="flex justify-between flex-wrap" key={key}>
                <span style={{minWidth: 80}}>{key}</span>
                <span className="text-black text-opacity-80">{value}</span>
              </div>            
            </div>
          ))}
        </div>
      )}

      { deviceInfo && (
        <div>
          <h3 className="text-base font-bold text-gray-500 py-3">Device</h3>
          { Object.entries(JSON.parse(deviceInfo))
            .map(([key, value]: [string, string]) => (
              <div className="text-sm text-gray-500 gap-y-2">
                <div style={{padding: '2px 0'}} className="flex justify-between flex-wrap" key={key}>
                  <span style={{minWidth: 80}}>{key}</span>
                  <span className="text-black text-opacity-80">{value}</span>
                </div>            
              </div>
          ))}
        </div>
      )}
    </div>
  )
}