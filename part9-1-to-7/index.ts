//import express = require("express");
import express from "express";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

//const express = require('express')
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get(`/bmi`, (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);
  if (!weight || !height || isNaN(weight) || isNaN(height)) {
    return res.json({ error: "malformatted parameters" });
  }
  return res.json({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post("/exercises", (req, res) => {
  const daily_exercises = (req.body as Record<string, unknown>)
    .daily_exercises as number[];
  const target = (req.body as Record<string, unknown>).target as number;

  if (!daily_exercises || !target) {
    return res.json({ error: "Parameters missing" });
  }
  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((e) => typeof e === "number") ||
    typeof target !== "number"
  ) {
    return res.json({ error: "Malformatted parametters" });
  }

  const result = calculateExercises(daily_exercises, target);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
