import type { Diagnose, Entry } from "../../types";
import { HealthCheckRating } from "../../types";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { green, lightGreen, yellow, red } from "@mui/material/colors";

const EntryInfo = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnose[];
}) => {
  console.log("diags", diagnoses);
  let baseDisplay = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CalendarMonthIcon fontSize="small" />
        <Typography variant="body2">{entry.date}</Typography>
      </Box>
      <Typography sx={{ fontStyle: "italic", fontWeight: 300 }}>
        {entry.description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ArrowForwardIcon fontSize="small" />
        <Typography variant="body2">Diagnose by {entry.specialist}</Typography>
      </Box>
    </Box>
  );
  let extraDisplay;
  switch (entry.type) {
    case "HealthCheck":
      const heartColor =
        entry.healthCheckRating === HealthCheckRating.Healthy
          ? green
          : entry.healthCheckRating === HealthCheckRating.LowRisk
            ? lightGreen
            : entry.healthCheckRating === HealthCheckRating.HighRisk
              ? yellow
              : red;
      extraDisplay = (
        <>
          <FavoriteIcon sx={{ color: heartColor[500] }} />
        </>
      );
      break;
    case "Hospital":
      extraDisplay = (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontWeight: "bold" }}>Discharge</Typography>
          <Typography variant="body2">{entry.discharge.criteria}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2">{entry.discharge.date}</Typography>
          </Box>
        </Box>
      );
      break;
    case "OccupationalHealthcare":
      extraDisplay = (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontWeight: "bold" }}>Employer</Typography>
          <Typography variant="body2">{entry.employerName}</Typography>
          {entry.sickLeave && (
            <Typography variant="body2">
              Sick Leave: {entry.sickLeave.startDate} -{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
        </Box>
      );
      break;
    default:
      break;
  }
  return (
    <Card
      sx={{
        margin: "16px 0",
        borderRadius: "8px",
        backgroundColor: "rgba(155, 202, 246, 0.15)",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {baseDisplay}
        {extraDisplay && (
          <>
            <Divider />
            {extraDisplay}
          </>
        )}
        {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Diagnoses
              </Typography>
              <List dense>
                {entry.diagnosisCodes?.map((code) => {
                  const d = diagnoses.find((elem) => elem.code === code);
                  return (
                    <ListItem key={code} disableGutters>
                      <ListItemText
                        primary={`${code} ${d?.name || ""}`}
                        secondary={d?.latin}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EntryInfo;
