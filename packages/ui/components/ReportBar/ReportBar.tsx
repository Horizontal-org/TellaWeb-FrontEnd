import { FunctionComponent } from "react";
import { Slider } from "../Slider/Slider";
import { Thumbnail } from "../Thumbnail/Thumbnail";
import { Report } from "../../domain/Report";
import { ReportInformation } from "../ReportInformation/ReportInformation";

type Props = {
  report?: Report;
};

export const ReportBar: FunctionComponent<Props> = ({ report }) => {
  return (
    <div className="flex flex-1 flex-col justify-center overflow-y-scroll">
      {report && (
        <>
          <h3 className="font-sans font-weight text-lg text-center py-4">
            {report.title}
          </h3>
          <Slider
            items={report.files.map((f, i) => (
              <div className="h-28" key={i.toString()}>
                <Thumbnail file={f} full />
              </div>
            ))}
          />
          <ReportInformation report={report} />
        </>
      )}
    </div>
  );
};
