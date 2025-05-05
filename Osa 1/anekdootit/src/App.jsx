import { useState } from "react";

const Anecdote = ({ anecdotes, votes, index }) => {
  return (
    <>
      <p>{anecdotes[index]}</p>
      <p>has {votes[index]} votes</p>
    </>
  );
};

const Button = ({ name, onClick }) => {
  return <button onClick={onClick}>{name}</button>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(anecdotes.map(() => 0));

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const increaseVote = (sel) => {
    const copy = [...votes];
    copy[sel]++;
    setVotes(copy);
  };

  const getMostVotedIndex = () => {
    let largest = 0;
    let index = 0;

    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > largest) {
        largest = votes[i];
        index = i;
      }
    }

    return index;
  };

  const mostVotedIdx = getMostVotedIndex();

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdotes={anecdotes} votes={votes} index={selected} />
      <Button name="vote" onClick={() => increaseVote(selected)} />
      <Button
        name="next anecdote"
        onClick={() => setSelected(getRandomInt(anecdotes.length))}
      />

      <h1>Anecdote with most votes</h1>
      <Anecdote anecdotes={anecdotes} votes={votes} index={mostVotedIdx} />
    </div>
  );
};

export default App;
