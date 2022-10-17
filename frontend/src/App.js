import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import { Home, Login } from "./pages";

const App = () => {
	const [userInfo] = useLocalStorage("user");
	const navigate = useNavigate();
	useEffect(() => {
		if (!userInfo) navigate("/login");
	});
	return (
		<Routes>
			<Route
				path="login"
				element={
					userInfo ? <Navigate to="/" replace={true} /> : <Login />
				}
			/>
			<Route path="/*" element={<Home />} />
		</Routes>
	);
};
export default App;
