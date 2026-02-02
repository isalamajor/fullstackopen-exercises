import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { useEffect, useState } from "react";
import { Diagnose, Gender, Patient } from "../../types";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
} from "@mui/material";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { getDianoses } from "../../services/diagnoses";
import EntryInfo from "./Entry";
import NewEntryForm from "./NewEntryForm";

const PatientPage = () => {
  const id = useParams().id;
  const [error, setError] = useState<string>("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        if (patient) {
          setPatient(patient);
          const diagnosesCodes = patient.entries.reduce((acc, entry) => {
            if (entry.diagnosisCodes) {
              return [...acc, ...entry.diagnosisCodes];
            }
            return acc;
          }, [] as string[]);
          fetchDiagnoses(diagnosesCodes);
        }
      } else {
        setError("Error obtaining user id");
      }
    };
    const fetchDiagnoses = async (diagnosisCodes: Array<Diagnose["code"]>) => {
      const diagnoses = await getDianoses();
      if (diagnoses) {
        setDiagnoses(diagnoses.filter((d) => diagnosisCodes.includes(d.code)));
      }
    };
    fetchPatient();
  }, []);

  return (
    <>
      {patient ? (
        <div>
          <p>{error}</p>
          <Typography variant="h2" style={{ marginTop: "0.5em" }}>
            {patient.name}
          </Typography>
          <Table style={{ marginBottom: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell>Occupation</TableCell>
                <TableCell>SSN</TableCell>
                <TableCell>Date of birth</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={patient.id}>
                <TableCell>
                  {patient.gender === Gender.Male ? (
                    <MaleIcon />
                  ) : patient.gender === Gender.Female ? (
                    <FemaleIcon />
                  ) : (
                    <TransgenderIcon />
                  )}
                </TableCell>
                <TableCell>{patient.occupation}</TableCell>
                <TableCell>{patient.ssn}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography variant="h5">Entries</Typography>

          {patient.entries.map((e) => (
            <EntryInfo entry={e} diagnoses={diagnoses} key={e.id} />
          ))}
          <Typography
            variant="h5"
            style={{ marginBottom: "0.5em", marginTop: "2em" }}
          >
            Add a new entry
          </Typography>
          <NewEntryForm
            patientId={patient.id}
            onEntryAdded={(patientUpdated) => setPatient(patientUpdated)}
          />
        </div>
      ) : (
        <p>Patient not found</p>
      )}
    </>
  );
};

export default PatientPage;
