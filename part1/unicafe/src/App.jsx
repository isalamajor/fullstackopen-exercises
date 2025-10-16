import { useState } from 'react'


const StatisticLine = ({ label, value }) => {
  return (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
  )
}

 // {label.toLower().includes("average") && "%"}

const Statistics = ({ good, neutral, bad} ) => {
  if (good + neutral + bad === 0) {
    return <><h1>Statistics</h1><p>No feedback given</p></>
  }
  return (
    <>    
      <h1>Statistics</h1>
      <table>
        <tbody>
      <StatisticLine label="Good" value={good}/>
      <StatisticLine label="Neutral" value={neutral}/>
      <StatisticLine label="Bad" value={neutral}/>
      <StatisticLine label="All" value={good + neutral + bad}/>
      <StatisticLine label="Average" value={(good - bad) / (good + neutral + bad)}/>
      <StatisticLine label="Positive" value={`${good / (good + neutral + bad)} %`}/>
      </tbody>
      </table>
    </>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const giveFeedbackOnClick = ( score ) => () => {
    if (score === 'GOOD') { setGood(good + 1) }
    else if (score === 'NEUTRAL') { setNeutral(neutral + 1) }
    else if ( score === 'BAD') { setBad(bad + 1) }
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <button onClick={giveFeedbackOnClick('GOOD')}>good</button>        
        <button onClick={giveFeedbackOnClick('NEUTRAL')}>neutral</button>
        <button onClick={giveFeedbackOnClick('BAD')}>bad</button>
      </div>
      
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App