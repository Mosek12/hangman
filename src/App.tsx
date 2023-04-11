import { useCallback, useLayoutEffect, useState } from "react";

import Keyboard from "./components/Keyboard";
import WordShower from "./components/Wordshower";
import TitleHP from "./components/Titlehp";
import EndScreen from "./components/Endscreen";

import { ERROR, INFO, WARN } from "./utils/logging";
import { hpArray, lettersUsedArray } from "./utils/arrays";
import { compareArrays, getRandomWordInLetters } from "./utils/functions";
import useNotMountEffect from "./hooks/usenotmounteffect";
import { useKeyDown } from "./hooks/reactkeyboardinputhook";

const App: React.FC = () => {
  const [word, setWord] = useState<letter[]>([]);
  const [lettersUsed, setLettersUsed] = useState(lettersUsedArray);
  const [lettersGuessed, setLettersGuessed] = useState<letter[]>([]);
  const [hp, setHp] = useState(hpArray);
  const [game, setGame] = useState(1);
  const [endScreenOpen, setEndScreenOpen] = useState(false);
  const [gameEndStatus, setGameEndStatus] = useState<gameEndStatusType>("");

  const newGame = useCallback(() => {
    setWord([]);
    setLettersUsed(lettersUsedArray);
    setLettersGuessed([]);
    setHp(hpArray);
    setGame(game + 1);
    setGameEndStatus("");
  }, [game]);

  const disableLetter = useCallback(
    (letter: letter) => {
      const nextLettersUsed = lettersUsed.map(({ letter, keyCode, value }) => ({
        letter: letter,
        keyCode: keyCode,
        value: value,
      }));

      let letterObj = nextLettersUsed.find(
        (element) => element.letter === letter
      );

      if (letterObj === undefined) {
        ERROR(`Letter '${letter}' not found`);
        return;
      }

      letterObj.value = false;

      setLettersUsed(nextLettersUsed);
      INFO(`Letter '${letter}' has been disabled`);
    },
    [lettersUsed]
  );

  const openEndScreen = useCallback((message: gameEndStatusType) => {
    setGameEndStatus(message);
    setEndScreenOpen((o) => !o);
  }, []);

  const hpMinus = useCallback(() => {
    //this function needs rewriting but it works for now
    if (hp.every((element) => element.value === false)) {
      ERROR("Called hpMinus when all hp is gone");
      openEndScreen("error");
      return;
    }
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
  }, [hp, openEndScreen]);

  const getWhitelist = useCallback(() => {
    
    const whitelist = lettersUsed.map((element) => {
      if (element.value) {
        return element.keyCode;
      }
    });
    return whitelist;
  }, [lettersUsed]);

  useNotMountEffect(() => {
    INFO(`Checking win`);

    if (word.length === 0) {
      return;
    }
    if (compareArrays(word, lettersGuessed)) {
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

  useLayoutEffect(() => {
    setWord(getRandomWordInLetters());
    INFO(`Game ${game} started \n Word has been randomized`);

    return () => {
      INFO(`Game ${game} restarted \n Word is empty`);
      setWord([]);
    };
  }, [game]);

  useKeyDown(
    (element) => {
      let letter = element.e.key as letter;
      handleClick(letter);
    },
    getWhitelist(),
    []
  );

  const handleClick = (letter: letter) => {
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
        <Keyboard lettersUsed={lettersUsed} handleClick={handleClick} />
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
