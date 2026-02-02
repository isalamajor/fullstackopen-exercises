import {
  Box,
  InputLabel,
  TextField,
  NativeSelect,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { DateField } from "@mui/x-date-pickers/DateField";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  EntryType,
  EntryFormValues,
  HealthCheckRating,
  Patient,
} from "../../types";
import patientService from "../../services/patients";

import Select, { SelectChangeEvent } from "@mui/material/Select";

const initValuesForm = {
  description: "",
  date: "2018-07-22",
  specialist: "",
  diagnosisCodes: [],
  type: EntryType.HealthCheck,
  healthCheckRating: HealthCheckRating.Healthy,
  employerName: undefined,
  sickLeave: {
    startDate: "2018-07-22",
    endDate: "2018-07-22",
  },
  discharge: {
    date: "2018-07-22",
    criteria: "",
  },
};

const NewEntryForm = ({
  patientId,
  onEntryAdded,
}: {
  patientId: string;
  onEntryAdded: (patientUpdated: Patient) => void;
}) => {
  const [basicInfo, setBasicInfo] = useState<EntryFormValues>(initValuesForm);
  const [clearCodesSelected, setClearCodesSelected] = useState<boolean>(false);

  const submitForm = async () => {
    const updatedPatient = await patientService.addEntry(patientId, basicInfo);
    if (updatedPatient) {
      onEntryAdded(updatedPatient);
      setBasicInfo(initValuesForm);
      setClearCodesSelected(!clearCodesSelected);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        my: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Description */}
      <InputLabel variant="standard" htmlFor="description">
        Description
      </InputLabel>
      <TextField
        id="description"
        label="Description"
        variant="filled"
        value={basicInfo.description}
        onChange={(e) =>
          setBasicInfo({ ...basicInfo, description: e.target.value })
        }
      />
      {/* Date */}
      <InputLabel variant="standard" htmlFor="start">
        Date
      </InputLabel>
      <DateField
        value={dayjs(basicInfo.date)}
        onChange={(newValue: Dayjs | null) =>
          setBasicInfo({
            ...basicInfo,
            date: newValue?.format("YYYY-MM-DD") || "2018-07-22",
          })
        }
      />

      {/* Specialist */}
      <InputLabel variant="standard" htmlFor="specialist">
        Specialist
      </InputLabel>
      <TextField
        id="specialist"
        label="Specialist"
        variant="filled"
        value={basicInfo.specialist}
        onChange={(e) =>
          setBasicInfo({ ...basicInfo, specialist: e.target.value })
        }
      />

      {/* Diagnosis Codes */}
      <InputLabel variant="standard" htmlFor="codes">
        Diagnosis codes
      </InputLabel>
      <CodeSelector
        submit={(codes) =>
          setBasicInfo({
            ...basicInfo,
            diagnosisCodes: codes,
          })
        }
        clearSelection={clearCodesSelected}
      />

      {/* Type */}
      <InputLabel variant="standard" htmlFor="typeSelector">
        Entry Type
      </InputLabel>
      <NativeSelect
        defaultValue={EntryType.HealthCheck}
        inputProps={{
          name: "typeSelector",
          id: "typeSelector",
        }}
        onChange={(e) =>
          setBasicInfo({ ...basicInfo, type: e.target.value as EntryType })
        }
      >
        <option value={EntryType.HealthCheck}>Health check</option>
        <option value={EntryType.OccupationalHealthcare}>
          Occupational Healthcare
        </option>
        <option value={EntryType.Hospital}>Hospital</option>
      </NativeSelect>

      {basicInfo.type === EntryType.HealthCheck ? (
        <>
          {/* Healthcheck Rating */}
          <InputLabel variant="standard" htmlFor="healthcheckRating">
            Healthcheck Rating
          </InputLabel>
          <NativeSelect
            defaultValue={HealthCheckRating.Healthy}
            inputProps={{
              name: "healthcheckRating",
              id: "healthcheckRating",
            }}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                healthCheckRating: parseInt(e.target.value),
              })
            }
          >
            <option value={HealthCheckRating.CriticalRisk}>CriticalRisk</option>
            <option value={HealthCheckRating.Healthy}>Healthy</option>
            <option value={HealthCheckRating.HighRisk}>HighRisk</option>
            <option value={HealthCheckRating.LowRisk}>LowRisk</option>
          </NativeSelect>
        </>
      ) : basicInfo.type === EntryType.OccupationalHealthcare ? (
        <>
          {/* Employer Name */}
          <TextField
            id="employer"
            label="Employer Name"
            variant="filled"
            value={basicInfo.employerName}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, employerName: e.target.value })
            }
          />

          {/* Sick Leave Start Date */}
          <label>Start Date</label>
          <input
            type="date"
            id="startDate"
            name="sick-leave-start"
            value={basicInfo.sickLeave?.startDate || "2026-01-30"}
            min="2018-01-01"
            max="2018-12-31"
            onChange={(e) => {
              if (e.target.value) {
                setBasicInfo({
                  ...basicInfo,
                  sickLeave: {
                    startDate: e.target.value,
                    endDate: basicInfo.sickLeave?.endDate ?? "2018-07-22",
                  },
                });
              }
            }}
          />
          {/* Sick Leave End Date */}
          <label>End Date</label>
          <input
            type="date"
            id="endDate"
            name="sick-leave-end"
            value={basicInfo.sickLeave?.endDate || "2026-01-30"}
            min="2018-01-01"
            max="2018-12-31"
            onChange={(e) => {
              if (e.target.value) {
                setBasicInfo({
                  ...basicInfo,
                  sickLeave: {
                    startDate: basicInfo.sickLeave?.startDate ?? "2018-07-22",
                    endDate: e.target.value,
                  },
                });
              }
            }}
          />
        </>
      ) : (
        <>
          {/* Discharge Date */}
          <label>Discharge Date</label>
          <input
            type="date"
            id="dischargeDate"
            name="discharge"
            value={basicInfo.discharge?.date || "2026-01-30"}
            min="2018-01-01"
            max="2018-12-31"
            onChange={(e) => {
              if (e.target.value) {
                setBasicInfo({
                  ...basicInfo,
                  discharge: {
                    date: e.target.value,
                    criteria: basicInfo.discharge?.criteria ?? "",
                  },
                });
              }
            }}
          />
          {/* Criteria */}
          <TextField
            id="criteria"
            label="Criteria"
            variant="filled"
            value={basicInfo.discharge?.criteria}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                discharge: {
                  date: basicInfo.discharge?.criteria ?? "2018-01-01",
                  criteria: e.target.value,
                },
              })
            }
          />
        </>
      )}
      <Button
        color="primary"
        variant="contained"
        style={{ float: "left" }}
        type="button"
        onClick={submitForm}
      >
        Add Entry
      </Button>
    </Box>
  );
};

export default NewEntryForm;

const CodeSelector = ({
  submit,
  clearSelection,
}: {
  submit: (newCode: string[]) => void;
  clearSelection: boolean;
}) => {
  const [codesSelected, setCodesSelected] = useState<string[]>([]);
  const codes = [
    "M24.2",
    "M51.2",
    "S03.5",
    "J10.1",
    "J06.9",
    "Z57.1",
    "N30.0",
    "H54.7",
    "J03.0",
    "L60.1",
    "Z74.3",
    "L20",
    "F43.2",
    "S62.5",
    "H35.29",
  ];

  useEffect(() => {
    setCodesSelected([]);
  }, [clearSelection]);

  const handleChange = (event: SelectChangeEvent<typeof codesSelected>) => {
    const {
      target: { value },
    } = event;
    setCodesSelected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
    submit(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <FormControl sx={{ m: 1, width: 300 }} id="codes">
      <InputLabel id="demo-multiple-name-label">Codes</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={codesSelected}
        onChange={handleChange}
        input={<OutlinedInput label="Codes" />}
        MenuProps={MenuProps}
      >
        {codes.map((code) => (
          <MenuItem key={code} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
