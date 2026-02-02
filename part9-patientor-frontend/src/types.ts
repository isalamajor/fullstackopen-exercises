interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

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

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose["code"]>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
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

type PatientFormValues = Omit<Patient, "id" | "entries">;

type NewEntry = Omit<Entry, "id">;

type Entry = HospitalEntry | OccupationalHealthCareEntry | HealthCheckEntry;

interface EntryFormValues {
  type: "HealthCheck" | "OccupationalHealthcare" | "Hospital";
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
  healthCheckRating?: number;
  employerName?: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
  discharge?: {
    date: string;
    criteria: string;
  };
}

export type {
  Diagnose,
  Patient,
  NonSensitivePatient,
  PatientFormValues,
  Entry,
  Diagnosis,
  BaseEntry,
  NewEntry,
  EntryFormValues,
};
