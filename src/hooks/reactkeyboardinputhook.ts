`All of this code isn't mine. It is copied from https://github.com/bobinrinder/react-keyboard-input-hook
due to problems with importing the package.`;

type KeyCallbackProps = {
  keyName: string;
  keyCode: number;
  e: KeyboardEvent;
};

type KeyState = {
  keyCode: number | null;
  keyCodeHistory: number[];
  keyName: string | null;
  keyNameHistory: string[];
};

import { useEffect, useState } from 'react';

export const FIRE_TV_KEY_CODES = [8, 13, 37, 38, 39, 40, 179, 227, 228];

export default function useKey(
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
  keyEvent: 'keyup' | 'keydown' = 'keyup',
  whitelist: (number | undefined)[] = [],
  blacklist: (number | undefined)[] = [],
) {
  // ensure valid event keyEvent
  if (keyEvent !== 'keyup' && keyEvent !== 'keydown') {
    console.warn("useKey keyEvent invalid, assumed keyEvent 'keydown' as fallback!");
    keyEvent = 'keydown';
  }
  // ensure only white- OR blacklist are set
  if (whitelist.length > 0 && blacklist.length > 0) {
    console.warn('White- and blacklist arrays > 0, emptied blacklist!');
    blacklist = [];
  }
  // init state
  const [state, setState] = useState({
    keyCode: null,
    keyCodeHistory: [],
    code: null,
    codeHistory: [],
  });

  useEffect(() => {
    // check if window and dom available (to exit early on Server-Side-Rendering)
    if (
      !(typeof window !== 'undefined' && window.document && window.document.createElement)
    ) {
      return null;
    }

    const handleKey = (e) => {
      // get key details from event
      const keyCode = e.keyCode;
      const code = e.code || 'UnknownKey';

      // check if white or blacklisted
      if (whitelist.length > 0 && whitelist.indexOf(keyCode) === -1) {
        return;
      }
      if (blacklist.length > 0 && blacklist.indexOf(keyCode) > -1) {
        return;
      }

      // update state with new key details
      setState((prevState) => {
        return {
          keyCode,
          keyCodeHistory: [...prevState.keyCodeHistory, keyCode],
          code,
          codeHistory: [...prevState.codeHistory, code],
        };
      });

      // handle callback (if exists)
      if (handleKeyCallback && typeof handleKeyCallback == 'function') {
        handleKeyCallback({
          keyName: code,
          keyCode,
          e,
        });
      }
    };

    // register event listener
    window.addEventListener(keyEvent, handleKey);
    // cleanup event listener
    return () => window.removeEventListener(keyEvent, handleKey);
  }, [handleKeyCallback, keyEvent, blacklist, whitelist]);

  return {
    keyCode: state.keyCode,
    keyCodeHistory: state.keyCodeHistory,
    keyName: state.code,
    keyNameHistory: state.codeHistory,
  };
}

export function useKeyUp(
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
  whitelist = [],
  blacklist = [],
) {
  return useKey(handleKeyCallback, 'keyup', whitelist, blacklist);
}

export function useKeyDown(
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
  whitelist: (number | undefined)[] = [],
  blacklist: (number | undefined)[] = [],
) {
  return useKey(handleKeyCallback, 'keydown', whitelist, blacklist);
}

export function useFireTvKeyUp(
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
  whitelist = FIRE_TV_KEY_CODES,
  blacklist = [],
) {
  return useKey(handleKeyCallback, 'keyup', whitelist, blacklist);
}

export function useFireTvKeyDown(
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
  whitelist = FIRE_TV_KEY_CODES,
  blacklist = [],
) {
  return useKey(handleKeyCallback, 'keydown', whitelist, blacklist);
}

export function useKeyCombo(
  keyCodes = [],
  handleKeyCallback: ((props: KeyCallbackProps) => void) | null = null,
) {
  const [currentlyPressedKeyCodes, setCurrentlyPressedKeyCodes] = useState([]);

  const handleKeyDown = ({ keyCode, keyName, e }) => {
    if (currentlyPressedKeyCodes.indexOf(keyCode) === -1) {
      if (checkIfArrayItemsinArray(keyCodes, [...currentlyPressedKeyCodes, keyCode])) {
        handleKeyCallback({ keyCode, keyName, e });
        setCurrentlyPressedKeyCodes([]);
      } else {
        setCurrentlyPressedKeyCodes((prevState) => [...prevState, keyCode]);
      }
    }
  };
  const handleKeyUp = ({ keyCode }) => {
    const indexOfPressedKeyCode = currentlyPressedKeyCodes.indexOf(keyCode);
    if (indexOfPressedKeyCode > -1) {
      setCurrentlyPressedKeyCodes((prevState) => [
        ...prevState.slice(0, indexOfPressedKeyCode),
        ...prevState.slice(indexOfPressedKeyCode + 1),
      ]);
    }
  };

  useKeyDown(handleKeyDown, keyCodes);
  useKeyUp(handleKeyUp, keyCodes);

  if (!keyCodes || keyCodes.length < 2 || !handleKeyCallback) {
    console.warn('Invalid arguments for usekeyCombo!');
  }
}

export function checkIfArrayItemsinArray(arrayItems, array) {
  if (array.length === 0 || arrayItems.length === 0) {
    return false;
  }
  for (let i = 0; i < arrayItems.length; i++) {
    if (array.indexOf(arrayItems[i]) === -1) {
      return false;
    }
  }
  return true;
}
