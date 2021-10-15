import { File } from "../../domain/File";
import { Device } from "../../domain/Device";
import { Environment } from "../../domain/Environment";

export const FileMokedData: File = {
  hash: "9F96F8F52D2EDFBE07AFA9E2626768B3433FA2087E8C980AD69CEC8AA60B9635",
  path: "media",
  name: "77c96227-97b1-4174-a8db-b1097834fad0.jpg",
  date: 1609864249034,
};

export const DeviceMokedData: Device = {
  manufacturer: "Xiaomi",
  hardware: "Xiaomi Redmi Note 8",
  deviceId: "bd717872-8f85-41ea-a233-cdcb6c5c4a01",
  screenSize: 5.827525745,
  locale: "USA",
  language: "español",
  networkType: "WiFi",
  connection: "Connected",
  dataType: "Mobile Data 4G",
  wifiMAC: "2c:ee:d6:1a:aa:32",
  ipv6: "2801:1E8:3:0:6AEE:1352:E7ED:6BB3 FE80::742F:5D1F:628E:CB0",
  ipv4: "10.5.1.2",
};

export const EnvMokedData: Environment = {
  accuracy: 92.9,
  altitude: 0,
  latitude: -31.8250154,
  longitude: -64.4297871,
  timestamp: 1611151983751,
  temperature: 0,
  light: 12.58481,
  locationProvider: "fused",
  speed: 0,
  cellInfo: [13259734, 2147483647],
  wifiInfo: ["home-c31s1", "LiMe.ql-b6aa8e"],
};
