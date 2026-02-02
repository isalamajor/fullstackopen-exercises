import { useEffect, useState } from "react";
import "./App.css";
import { getDiaries, postDiary } from "./services/diaries";
import { Visibility, Weather, type DiaryEntry } from "./types";
import axios from "axios";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<Omit<DiaryEntry, "id">>({
    date: "2017-01-01",
    weather: Weather.Rainy,
    visibility: Visibility.Poor,
    comment: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const showError = async (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const diariesFetched = await getDiaries();
        setDiaries(diariesFetched);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          showError(e.response?.data ?? "Unknown error");
        } else {
          showError("Something went wrong");
        }
      }
    };
    fetchDiaries();
  }, []);

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const justAdded = await postDiary(newDiary);
      setDiaries([...diaries, justAdded]);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        showError(e.response?.data ?? "Unknown error");
      } else {
        showError("Something went wrong");
      }
    }
  };

  return (
    <>
      <p style={{ color: "#F54927" }}>{errorMessage}</p>

      <h1>Diaries</h1>
      {diaries &&
        diaries.map((d) => (
          <div key={d.id}>
            {d.date} {d.weather} {d.visibility}
          </div>
        ))}
      <h2>Add new</h2>
      <form onSubmit={(e) => addEntry(e)}>
        <input
          type="date"
          value={newDiary.date}
          onChange={(e) => setNewDiary({ ...newDiary, date: e.target.value })}
          placeholder="Date"
        />
        <select
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value as Weather })
          }
        >
          {Object.values(Weather).map((op) => (
            <option value={op}>{op.toString()}</option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setNewDiary({
              ...newDiary,
              visibility: e.target.value as Visibility,
            })
          }
        >
          {Object.values(Visibility).map((op) => (
            <option value={op}>{op.toString()}</option>
          ))}
        </select>
        <input
          value={newDiary.comment}
          onChange={(e) =>
            setNewDiary({ ...newDiary, comment: e.target.value })
          }
          placeholder="Comment"
        />
        <button type="submit">Post</button>
      </form>
    </>
  );
}

export default App;
