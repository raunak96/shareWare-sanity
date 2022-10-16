import { useState } from "react";

const useLocalStorage = (key, initialValue) => {
	const [localStorageValue, setLocalStorageValue] = useState(() =>
		getLocalStorageValue(key, initialValue)
	);

	const setValue = value => {
		// Check if function
		const valueToStore =
			value instanceof Function ? value(localStorageValue) : value;
		// Set to state
		setLocalStorageValue(value);
		// Set to local storage
		localStorage.setItem(key, JSON.stringify(valueToStore));
	};

	return [localStorageValue, setValue];
};

function getLocalStorageValue(key, initialValue) {
	try {
		const itemFromStorage = localStorage.getItem(key);
		return itemFromStorage ? JSON.parse(itemFromStorage) : initialValue;
	} catch {
		localStorage.clear();
		return undefined;
	}
}

export default useLocalStorage;
