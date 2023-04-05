import { useCallback, useEffect, useState } from "react";
import randomWords from "random-words";

import Keyboard from "@/components/Keyboard";
import WordShower from "@/components/Wordshower";
import TitleHP from "@/components/Titlehp";
import EndScreen from "@/components/Endscreen";

import { INFO } from "@/utils/logging.js";
import useNotMountEffect from "@/hooks/usenotmounteffect";

const letterUsedArray = [
  { letter: "a", value: true },
  { letter: "b", value: true },
  { letter: "c", value: true },
  { letter: "d", value: true },
  { letter: "e", value: true },
  { letter: "f", value: true },
  { letter: "g", value: true },
  { letter: "h", value: true },
  { letter: "i", value: true },
  { letter: "j", value: true },
  { letter: "k", value: true },
  { letter: "l", value: true },
  { letter: "m", value: true },
  { letter: "n", value: true },
  { letter: "o", value: true },
  { letter: "p", value: true },
  { letter: "q", value: true },
  { letter: "r", value: true },
  { letter: "s", value: true },
  { letter: "t", value: true },
  { letter: "u", value: true },
  { letter: "v", value: true },
  { letter: "w", value: true },
  { letter: "x", value: true },
  { letter: "y", value: true },
  { letter: "z", value: true },
];

const hpArray = [
  { letter: "H", value: true },
  { letter: "A", value: true },
  { letter: "N", value: true },
  { letter: "G", value: true },
  { letter: "M", value: true },
  { letter: "A", value: true },
  { letter: "N", value: true },
];

function checkWin(word, guessed) {
  return word.every((element) => {
    if (guessed.includes(element)) {
      return true;
    }

    return false;
  });
}

const App = () => {
  const [word, setWord] = useState([]);
  const [letterUsedTable, setLetterUsedTable] = useState(letterUsedArray);
  const [lettersGuessed, setLettersGuessed] = useState([]);
  const [hp, setHp] = useState(hpArray);
  const [game, setGame] = useState(1);
  const [endScreenOpen, setEndScreenOpen] = useState(false);
  const [gameEndStatus, setGameEndStatus] = useState("");

  const newGame = useCallback(() => {
    setWord([]);
    setLetterUsedTable(letterUsedArray);
    setLettersGuessed([]);
    setHp(hpArray);
    setGame(game + 1);
    setGameEndStatus("");
  }, [game]);

  const disableLetter = useCallback(
    (index) => {
      const nextLetterUsedTable = letterUsedTable.map(({ letter, value }) => ({
        letter: letter,
        value: value,
      }));
      nextLetterUsedTable[index].value = false;

      setLetterUsedTable(nextLetterUsedTable);
      INFO(`Letter '${nextLetterUsedTable[index].letter}' has been disabled`);
    },
    [letterUsedTable]
  );

  const hpMinus = useCallback(() => {
    while (true) {
      let randomIndex = Math.floor(Math.random() * 7);
      if (hp[randomIndex].value) {
        const nextHp = hp.map(({ letter, value }) => ({
          letter: letter,
          value: value,
        }));
        nextHp[randomIndex].value = false;

        setHp(nextHp);
        INFO("Hp down");
        break;
      }
    }
  }, [hp]);

  const openEndScreen = useCallback((message) => {
    setGameEndStatus(`${message}!`);
    setEndScreenOpen((o) => !o);
  }, []);

  useNotMountEffect(() => {
    INFO(`Checking win`);

    if (word.length === 0) {
      return;
    }
    if (checkWin(word, lettersGuessed)) {
      INFO("Word is guessed \n You win!");
      openEndScreen("You win");
    }

    return () => {
      if (word.length !== 0) {
        setEndScreenOpen(false);
      }
    };
  }, [lettersGuessed, word, openEndScreen]);

  useNotMountEffect(() => {
    INFO(`Checking lose`);

    if (hp.every((element) => element.value === false)) {
      INFO("Hp is empty \n You lose!");
      openEndScreen("You lose");
    }

    return () => {
      setEndScreenOpen(false);
    };
  }, [hp, openEndScreen]);

  useEffect(() => {
    setWord(randomWords().split(""));
    INFO(`Game ${game} started \n Word has been randomized`);

    return () => {
      INFO(`Game ${game} restarted \n Word is empty`);
      setWord([]);
    };
  }, [game]);

  const handleClick = (index, letter) => {
    disableLetter(index);

    if (word.includes(letter)) {
      setLettersGuessed([...lettersGuessed, letter]);
      INFO(`Letter '${letter}' has been guessed!`);
    } else {
      hpMinus();
    }
  };

  return (
    <div className="mainContainer">
      <div className="inlineDiv">
        <TitleHP hp={hp} />
        <WordShower word={word} lettersGuessed={lettersGuessed} />
        <Keyboard letterUsedTable={letterUsedTable} handleClick={handleClick} />
      </div>
      <EndScreen
        open={endScreenOpen}
        setOpen={setEndScreenOpen}
        newGame={newGame}
      />
    </div>
  );
};

export default App;
