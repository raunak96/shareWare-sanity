import { useEffect, useState } from "react";

const useDebounce = (value, delay = 700) => {
	const [debouncedValue, setDebouncedValue] = useState("");
	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(timeout);
	}, [value, delay]);
	return [debouncedValue];
};

export default useDebounce;
