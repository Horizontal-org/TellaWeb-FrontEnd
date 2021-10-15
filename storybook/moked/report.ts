import { Report } from "../../packages/ui/domain/Report";
import { FilesMokedData } from "./files";

export const FakeReport: Report = {
  title: "Cops ask for bribe",
  id: "uuid-abc123",
  author: {
    username: "Raphael Mimoun",
    id: "uuid-123abc",
  },
  date: 1609864249034,
  files: [...FilesMokedData, ...FilesMokedData],
};
