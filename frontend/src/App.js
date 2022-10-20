import { Navigate, Route, Routes } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import { Home, Login } from "./pages";

const App = () => {
	const [userInfo, setUserInfo, clearUserInfo] = useLocalStorage("user");

	return (
		<Routes>
			<Route
				path="login"
				element={
					userInfo ? (
						<Navigate to="/" replace={true} />
					) : (
						<Login setUserInfo={setUserInfo} />
					)
				}
			/>
			<Route
				path="/*"
				element={
					userInfo ? (
						<Home clearUserInfo={clearUserInfo} />
					) : (
						<Navigate to="/login" replace={true} />
					)
				}
			/>
		</Routes>
	);
};
export default App;
