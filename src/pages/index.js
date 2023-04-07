import { useCallback, useEffect, useRef, useState } from "react";
import randomWords from "random-words";

import Keyboard from "@/components/Keyboard";
import WordShower from "@/components/Wordshower";
import TitleHP from "@/components/Titlehp";
import EndScreen from "@/components/Endscreen";

import { INFO, WARN } from "@/utils/logging.js";
import useNotMountEffect from "@/hooks/usenotmounteffect";
import { useKeyDown } from "@/hooks/reactkeyboardinputhook";

const letterUsedArray = [
  { letter: "a", keyCode: 65, value: true },
  { letter: "b", keyCode: 66, value: true },
  { letter: "c", keyCode: 67, value: true },
  { letter: "d", keyCode: 68, value: true },
  { letter: "e", keyCode: 69, value: true },
  { letter: "f", keyCode: 70, value: true },
  { letter: "g", keyCode: 71, value: true },
  { letter: "h", keyCode: 72, value: true },
  { letter: "i", keyCode: 73, value: true },
  { letter: "j", keyCode: 74, value: true },
  { letter: "k", keyCode: 75, value: true },
  { letter: "l", keyCode: 76, value: true },
  { letter: "m", keyCode: 77, value: true },
  { letter: "n", keyCode: 78, value: true },
  { letter: "o", keyCode: 79, value: true },
  { letter: "p", keyCode: 80, value: true },
  { letter: "q", keyCode: 81, value: true },
  { letter: "r", keyCode: 82, value: true },
  { letter: "s", keyCode: 83, value: true },
  { letter: "t", keyCode: 84, value: true },
  { letter: "u", keyCode: 85, value: true },
  { letter: "v", keyCode: 86, value: true },
  { letter: "w", keyCode: 87, value: true },
  { letter: "x", keyCode: 88, value: true },
  { letter: "y", keyCode: 89, value: true },
  { letter: "z", keyCode: 90, value: true },
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
    (letter) => {
      const nextLetterUsedTable = letterUsedTable.map(
        ({ letter, keyCode, value }) => ({
          letter: letter,
          keyCode: keyCode,
          value: value,
        })
      );

      let letterObj = nextLetterUsedTable.find(
        (element) => element.letter === letter
      );

      letterObj.value = false;

      setLetterUsedTable(nextLetterUsedTable);
      INFO(`Letter '${letter}' has been disabled`);
    },
    [letterUsedTable]
  );

  const hpMinus = useCallback(() => {
    while (true) {
      let randomIndex = Math.floor(Math.random() * 7);
      INFO(`Random index: ${randomIndex}`);
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
    setGameEndStatus(`${message}`);
    setEndScreenOpen((o) => !o);
  }, []);

  const getWhitelist = useCallback(() => {
    const whitelist = letterUsedTable.map((element) => {
      if (element.value) {
        return element.keyCode;
      }
    });
    return whitelist;
  }, [letterUsedTable]);

  useNotMountEffect(() => {
    INFO(`Checking win`);

    if (word.length === 0) {
      return;
    }
    if (checkWin(word, lettersGuessed)) {
      INFO("Word is guessed \n You win!");
      openEndScreen("win");
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
      openEndScreen("lose");
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

  useKeyDown(
    (element) => {
      handleClick(element.e.key);
    },
    getWhitelist(),
    []
  );

  const handleClick = (letter) => {
    if (gameEndStatus !== "") {
      WARN("Cannot click when end screen is open");
      return;
    }
    disableLetter(letter);

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
        status={gameEndStatus}
        word={word}
      />
    </div>
  );
};

export default App;
