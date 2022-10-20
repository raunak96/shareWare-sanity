import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import logo from "../assets/logo.webp";
import { Sidebar } from "../components";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { client } from "../sanity.config.js";
import { getUserQuery } from "../queries/userQueries";
import { UserProfile, Pins } from ".";

const Home = ({ clearUserInfo }) => {
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [user, setUser] = useState(null);
	const scrollRef = useRef(null);
	const [userInfo] = useLocalStorage("user");

	useEffect(() => {
		/* Every time this component rendered scroll to Top of page */
		scrollRef.current.scrollTo(0, 0);
	});

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const query = getUserQuery(userInfo?.googleId);
			try {
				const data = await client.fetch(query);
				setUser(data[0]);
			} catch (err) {}
		};
		if (userInfo?.googleId) fetchCurrentUser();
	}, [userInfo?.googleId]);
	return (
		<div className="flex bg-gray-50 flex-col md:flex-row h-screen transition-height duration-75 ease-out">
			{/* >= Medium Screen Sidebar -> flex-initial is flex: 0 1 auto -> which means it will not grow even if enough free space present but shrink if not enough space  */}
			<div className="hidden md:flex h-screen flex-initial">
				<Sidebar user={user && user} />
			</div>

			{/* Small Screen Nav and Sidebar */}
			<div className="flex flex-row md:hidden">
				<div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
					<HiMenu
						fontSize={40}
						className={`cursor-pointer ${
							toggleSidebar && "invisible"
						}`}
						onClick={() => setToggleSidebar(true)}
					/>
					<Link to="/" className={toggleSidebar ? "invisible" : ""}>
						<img src={logo} alt="logo" className="w-28" />
					</Link>
					<Link to={`user-profile/${user?._id}`}>
						<img
							src={user?.avatar}
							alt="logo"
							className="w-9 h-9 rounded-full"
						/>
					</Link>
				</div>
				{toggleSidebar && (
					<div className="fixed w-2/3 sm:w-2/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
						<div className="absolute w-full flex justify-end items-center p-2">
							<AiFillCloseCircle
								fontSize={30}
								className="cursor-pointer"
								onClick={() => setToggleSidebar(false)}
							/>
						</div>
						<Sidebar
							closeToggle={setToggleSidebar}
							user={user && user}
						/>
					</div>
				)}
			</div>
			<div
				className="pb-2 flex-1 h-screen overflow-y-scroll"
				ref={scrollRef}>
				{/* Nested Routes to Home("/") */}
				<Routes>
					<Route
						path="/user-profile/:userId"
						element={
							<UserProfile
								user={user}
								clearUserInfo={clearUserInfo}
							/>
						}
					/>
					{user && <Route path="/*" element={<Pins user={user} />} />}
				</Routes>
			</div>
		</div>
	);
};
export default Home;
