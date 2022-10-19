import { useState } from "react";
import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Feed, PinDetail, Search } from "../components";
import { CreatePin } from "../pages";

const Pins = ({ user }) => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<div className="px-2 md:px-5">
			<div className="bg-gray-50">
				<Navbar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					user={user}
				/>
			</div>
			<div className="h-full">
				<Routes>
					<Route path="/" element={<Feed user={user} />} />
					<Route
						path="/category/:categoryName"
						element={<Feed user={user} />}
					/>
					<Route
						path="/pin-detail/:pinId"
						element={<PinDetail user={user} />}
					/>
					<Route
						path="/create-pin"
						element={<CreatePin user={user} />}
					/>
					<Route
						path="/search"
						element={
							<Search
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
							/>
						}
					/>
				</Routes>
			</div>
		</div>
	);
};
export default Pins;
