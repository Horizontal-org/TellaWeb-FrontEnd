import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "tellaweb";

export enum AppLockChoice {
  PATTERN = 0,
  PIN = 1,
  PASSWORD = 2,
  UNRECOGNIZED = -1,
}

export function appLockChoiceFromJSON(object: any): AppLockChoice {
  switch (object) {
    case 0:
    case "PATTERN":
      return AppLockChoice.PATTERN;
    case 1:
    case "PIN":
      return AppLockChoice.PIN;
    case 2:
    case "PASSWORD":
      return AppLockChoice.PASSWORD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AppLockChoice.UNRECOGNIZED;
  }
}

export function appLockChoiceToJSON(object: AppLockChoice): string {
  switch (object) {
    case AppLockChoice.PATTERN:
      return "PATTERN";
    case AppLockChoice.PIN:
      return "PIN";
    case AppLockChoice.PASSWORD:
      return "PASSWORD";
    default:
      return "UNKNOWN";
  }
}

export enum DowloadMethodChoice {
  DOWNLOAD = 0,
  CODE = 1,
  QR = 2,
  UNRECOGNIZED = -1,
}

export function dowloadMethodChoiceFromJSON(object: any): DowloadMethodChoice {
  switch (object) {
    case 0:
    case "DOWNLOAD":
      return DowloadMethodChoice.DOWNLOAD;
    case 1:
    case "CODE":
      return DowloadMethodChoice.CODE;
    case 2:
    case "QR":
      return DowloadMethodChoice.QR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DowloadMethodChoice.UNRECOGNIZED;
  }
}

export function dowloadMethodChoiceToJSON(object: DowloadMethodChoice): string {
  switch (object) {
    case DowloadMethodChoice.DOWNLOAD:
      return "DOWNLOAD";
    case DowloadMethodChoice.CODE:
      return "CODE";
    case DowloadMethodChoice.QR:
      return "QR";
    default:
      return "UNKNOWN";
  }
}

export enum CamouflageChoice {
  ICON = 0,
  CALCULATOR = 1,
  NOTEPAD = 2,
  UNRECOGNIZED = -1,
}

export function camouflageChoiceFromJSON(object: any): CamouflageChoice {
  switch (object) {
    case 0:
    case "ICON":
      return CamouflageChoice.ICON;
    case 1:
    case "CALCULATOR":
      return CamouflageChoice.CALCULATOR;
    case 2:
    case "NOTEPAD":
      return CamouflageChoice.NOTEPAD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CamouflageChoice.UNRECOGNIZED;
  }
}

export function camouflageChoiceToJSON(object: CamouflageChoice): string {
  switch (object) {
    case CamouflageChoice.ICON:
      return "ICON";
    case CamouflageChoice.CALCULATOR:
      return "CALCULATOR";
    case CamouflageChoice.NOTEPAD:
      return "NOTEPAD";
    default:
      return "UNKNOWN";
  }
}

export interface CrashReport {
  share: boolean;
  changeable: boolean;
}

export interface Configuration {
  id: string;
  name: string;
  date: number;
  connections: number;
  status: string;
  applock: boolean[];
  camoflage: boolean[];
}

const baseCrashReport: object = { share: false, changeable: false };

export const CrashReport = {
  encode(message: CrashReport, writer: Writer = Writer.create()): Writer {
    if (message.share === true) {
      writer.uint32(8).bool(message.share);
    }
    if (message.changeable === true) {
      writer.uint32(16).bool(message.changeable);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CrashReport {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCrashReport } as CrashReport;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.share = reader.bool();
          break;
        case 2:
          message.changeable = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CrashReport {
    const message = { ...baseCrashReport } as CrashReport;
    if (object.share !== undefined && object.share !== null) {
      message.share = Boolean(object.share);
    } else {
      message.share = false;
    }
    if (object.changeable !== undefined && object.changeable !== null) {
      message.changeable = Boolean(object.changeable);
    } else {
      message.changeable = false;
    }
    return message;
  },

  toJSON(message: CrashReport): unknown {
    const obj: any = {};
    message.share !== undefined && (obj.share = message.share);
    message.changeable !== undefined && (obj.changeable = message.changeable);
    return obj;
  },

  fromPartial(object: DeepPartial<CrashReport>): CrashReport {
    const message = { ...baseCrashReport } as CrashReport;
    if (object.share !== undefined && object.share !== null) {
      message.share = object.share;
    } else {
      message.share = false;
    }
    if (object.changeable !== undefined && object.changeable !== null) {
      message.changeable = object.changeable;
    } else {
      message.changeable = false;
    }
    return message;
  },
};

const baseConfiguration: object = {
  id: "",
  name: "",
  date: 0,
  connections: 0,
  status: "",
  applock: false,
  camoflage: false,
};

export const Configuration = {
  encode(message: Configuration, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.date !== 0) {
      writer.uint32(24).int32(message.date);
    }
    if (message.connections !== 0) {
      writer.uint32(32).int32(message.connections);
    }
    if (message.status !== "") {
      writer.uint32(42).string(message.status);
    }
    writer.uint32(50).fork();
    for (const v of message.applock) {
      writer.bool(v);
    }
    writer.ldelim();
    writer.uint32(58).fork();
    for (const v of message.camoflage) {
      writer.bool(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Configuration {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseConfiguration } as Configuration;
    message.applock = [];
    message.camoflage = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.date = reader.int32();
          break;
        case 4:
          message.connections = reader.int32();
          break;
        case 5:
          message.status = reader.string();
          break;
        case 6:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.applock.push(reader.bool());
            }
          } else {
            message.applock.push(reader.bool());
          }
          break;
        case 7:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.camoflage.push(reader.bool());
            }
          } else {
            message.camoflage.push(reader.bool());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Configuration {
    const message = { ...baseConfiguration } as Configuration;
    message.applock = [];
    message.camoflage = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.date !== undefined && object.date !== null) {
      message.date = Number(object.date);
    } else {
      message.date = 0;
    }
    if (object.connections !== undefined && object.connections !== null) {
      message.connections = Number(object.connections);
    } else {
      message.connections = 0;
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = String(object.status);
    } else {
      message.status = "";
    }
    if (object.applock !== undefined && object.applock !== null) {
      for (const e of object.applock) {
        message.applock.push(Boolean(e));
      }
    }
    if (object.camoflage !== undefined && object.camoflage !== null) {
      for (const e of object.camoflage) {
        message.camoflage.push(Boolean(e));
      }
    }
    return message;
  },

  toJSON(message: Configuration): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.date !== undefined && (obj.date = message.date);
    message.connections !== undefined &&
      (obj.connections = message.connections);
    message.status !== undefined && (obj.status = message.status);
    if (message.applock) {
      obj.applock = message.applock.map((e) => e);
    } else {
      obj.applock = [];
    }
    if (message.camoflage) {
      obj.camoflage = message.camoflage.map((e) => e);
    } else {
      obj.camoflage = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Configuration>): Configuration {
    const message = { ...baseConfiguration } as Configuration;
    message.applock = [];
    message.camoflage = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.date !== undefined && object.date !== null) {
      message.date = object.date;
    } else {
      message.date = 0;
    }
    if (object.connections !== undefined && object.connections !== null) {
      message.connections = object.connections;
    } else {
      message.connections = 0;
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = "";
    }
    if (object.applock !== undefined && object.applock !== null) {
      for (const e of object.applock) {
        message.applock.push(e);
      }
    }
    if (object.camoflage !== undefined && object.camoflage !== null) {
      for (const e of object.camoflage) {
        message.camoflage.push(e);
      }
    }
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
