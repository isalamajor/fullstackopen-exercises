interface Return {
  periodLength: number;
  trainingDays: number;
  target: number;
  avgTime: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
}

const calculateExercises = (hours: number[], goal: number): Return => {
  const totalHours = hours.reduce((acc, day) => acc + day, 0);
  const days = hours.length;
  const success = totalHours >= goal;
  const score = !success
    ? 1
    : (hours.filter((day) => day < average / 2).length / days) * 100 > 40
      ? 2
      : 3;
  const average = days === 0 ? 0 : totalHours / days;
  let comments = "Goal not met...";
  if (success) {
    comments = "Well done!";
    if ((hours.filter((day) => day < average / 2).length / days) * 100 > 40) {
      comments = "Good, but redistribute your time more evenly next time";
    }
  }
  return {
    periodLength: days,
    trainingDays: hours.filter((day) => day !== 0).length,
    target: goal,
    avgTime: average,
    success: success,
    rating: score,
    ratingDescription: comments,
  };
};

/*let numbers: number[] = [];
try {
  numbers = JSON.parse(process.argv[2]);
  console.log(calculateExercises(numbers, Number(process.argv[3])));
} catch (err) {
  console.log(
    'Error when parsing firsh parameter. Use example: npm run calculateExercises "[3, 0, 2, 4.5, 0, 3, 1]" 2',
  );
}*/

export default calculateExercises;
