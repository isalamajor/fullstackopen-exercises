import { v1 as uuid } from "uuid";

interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};
const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isEntryType = (param: string): param is EntryType => {
  return Object.values(EntryType)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthcheckRating = (param: unknown): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .filter((v) => typeof v === "number")
    .includes(param as HealthCheckRating);
};

const parseString = (param: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Invalid parameter, not a string: ${param}`);
  }
  return param;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnose["code"]> => {
  if (!codes) {
    return [];
  }

  if (!Array.isArray(codes)) {
    throw new Error("Diagnosis codes must be an array");
  }

  if (
    !codes.every((code): code is Diagnose["code"] => typeof code === "string")
  ) {
    throw new Error("All diagnosis codes must be strings");
  }

  return codes;
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isString(type) || !isEntryType(type)) {
    throw new Error("Incorrect or missing type: " + type);
  }
  return type;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (
    rating === null ||
    rating === undefined ||
    typeof rating !== "number" ||
    !isHealthcheckRating(rating)
  ) {
    throw new Error("Incorrect or missing health check rating: " + rating);
  }
  return rating;
};

type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

type UnitOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnose["code"][];
}
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthCareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}
interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

const toNewEntry = (body: any): Entry => {
  const base = {
    id: uuid(),
    description: parseString(body.description),
    date: parseString(body.date),
    specialist: parseString(body.specialist),
    diagnosisCodes: parseDiagnosisCodes(body.diagnosisCodes),
  };

  switch (body.type) {
    case "HealthCheck":
      return {
        ...base,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(body.healthCheckRating),
      };

    case "OccupationalHealthcare":
      return {
        ...base,
        type: "OccupationalHealthcare",
        employerName: parseString(body.employerName),
        ...(body.sickLeave && {
          sickLeave: {
            startDate: parseString(body.sickLeave.startDate),
            endDate: parseString(body.sickLeave.endDate),
          },
        }),
      };

    case "Hospital":
      return {
        ...base,
        type: "Hospital",
        discharge: {
          date: parseString(body.discharge.date),
          criteria: parseString(body.discharge.criteria),
        },
      };

    default:
      throw new Error("Invalid entry type");
  }
};

export type Entry =
  | HospitalEntry
  | OccupationalHealthCareEntry
  | HealthCheckEntry;

export {
  Diagnose,
  Patient,
  Gender,
  NonSensitivePatient,
  UnitOmit,
  EntryType,
  parseString,
  parseGender,
  parseEntryType,
  parseDiagnosisCodes,
  parseHealthCheckRating,
  toNewEntry,
};
