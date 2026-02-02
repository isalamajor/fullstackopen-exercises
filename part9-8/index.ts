import express from "express";
import cors from "cors";
import {
  Diagnose,
  Patient,
  parseString,
  parseGender,
  NonSensitivePatient,
  toNewEntry,
} from "./types";
import diagnosesData from "./data/diagnoses";
import patientsData from "./data/patients";
import { v1 as uuid } from "uuid";

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res) => {
  const diagnoses: Diagnose[] = diagnosesData;
  return res.json(diagnoses);
});

app.get("/api/patients", (_req, res) => {
  const patients: NonSensitivePatient[] = patientsData;
  return res.json(patients);
});

app.get("/api/patients/:id", (req, res) => {
  const patient: Patient | undefined = patientsData.find(
    (p) => p.id === req.params.id,
  );
  if (!patient) {
    return res
      .status(404)
      .json({ error: `Patient with id ${req.params.id} not found.` });
  }
  return res.json(patient);
});

app.post("/api/patients", (req, res) => {
  const patient: Patient = {
    id: uuid(),
    name: parseString(req.body.name),
    dateOfBirth: parseString(req.body.dateOfBirth),
    ssn: parseString(req.body.ssn),
    gender: parseGender(req.body.gender),
    occupation: parseString(req.body.occupation),
    entries: req.body.entries,
  };
  console.log(patient);
  patientsData.push(patient);
  return res.send(patient);
});

app.post("/api/patients/:id/entries", (req, res) => {
  const patient: Patient | undefined = patientsData.find(
    (p) => p.id === req.params.id,
  );
  if (!patient) {
    return res
      .status(404)
      .json({ error: `Patient with id ${req.params.id} not found.` });
  }
  const newEntry = toNewEntry(req.body);
  console.log("body", req.body);
  console.log(newEntry);
  patient.entries.push(newEntry);
  // El paciente se actualiza automáticamente en patientsData
  // porque es una referencia al mismo objeto

  return res.send(patient);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
