import { Navigate, Route, Routes } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import { Home, Login } from "./pages";

const App = () => {
	const [userInfo, setValue] = useLocalStorage("user");

	return (
		<Routes>
			<Route
				path="login"
				element={
					userInfo ? (
						<Navigate to="/" replace={true} />
					) : (
						<Login setValue={setValue} />
					)
				}
			/>
			<Route
				path="/*"
				element={
					userInfo ? (
						<Home />
					) : (
						<Navigate to="/login" replace={true} />
					)
				}
			/>
		</Routes>
	);
};
export default App;
