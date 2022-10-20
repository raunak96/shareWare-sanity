import { useEffect } from "react";
import { useState } from "react";
import { GoogleLogout } from "react-google-login";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { MasonryLayout, Spinner } from "../components";
import {
	getUserCreatedPinsQuery,
	getUserQuery,
	getUserSavedPinsQuery,
} from "../queries/userQueries";
import { client } from "../sanity.config";

const UserProfile = ({ user: currentUser, clearUserInfo }) => {
	const [user, setUser] = useState(null);
	const [pins, setPins] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [activeBtn, setActiveBtn] = useState("created");
	const { userId } = useParams();

	useEffect(() => {
		const fetchCurrentUser = async () => {
			setIsLoading(true);
			const query = getUserQuery(userId);
			try {
				const data = await client.fetch(query);
				setUser(data[0] ?? {});
			} catch (err) {
				setUser(null);
				console.log("Could not fetch user", err);
			} finally {
				setIsLoading(false);
			}
		};
		if (userId) fetchCurrentUser();
	}, [userId]);

	useEffect(() => {
		const getUserPins = async () => {
			const pinType = activeBtn;
			setPins(null);
			const query =
				pinType === "created"
					? getUserCreatedPinsQuery(userId)
					: getUserSavedPinsQuery(userId);

			try {
				const data = await client.fetch(query);
				setPins(data);
			} catch (error) {
				console.log(`Could not get User's ${pinType} Pins`);
				setPins([]);
			}
		};
		getUserPins();
	}, [activeBtn, userId]);

	const logout = () => {
		clearUserInfo();
	};

	if (isLoading)
		return <Spinner message="Loading user profile..." color="#4fa94d" />;
	if (!user)
		return (
			<Spinner
				message="The user details could not be retrieved. Try refreshing the page
				or visit later."
				isLoader={false}
			/>
		);
	if (!Object.keys(user).length)
		return <Spinner message="No such user exists." isLoader={false} />;
	return (
		<div className="relative pb-2 h-full justify-center items-center">
			<div className="flex flex-col pb-5">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center">
						<img
							className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
							src="https://source.unsplash.com/1600x900/?nature,photography,technology"
							alt="user-pic"
						/>
						<img
							className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
							src={user.avatar}
							alt="user-pic"
						/>
					</div>
					<h1 className="font-bold text-3xl text-center mt-3 capitalize">
						{user.userName}
					</h1>
					<div className="absolute top-0 z-1 right-0 p-2">
						{userId === currentUser?._id && (
							<GoogleLogout
								clientId={`${process.env.REACT_APP_GOOGLE_CID}`}
								render={renderProps => (
									<button
										type="button"
										className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}>
										<AiOutlineLogout
											color="red"
											fontSize={21}
										/>
									</button>
								)}
								onLogoutSuccess={logout}
								cookiePolicy="single_host_origin"
							/>
						)}
					</div>
				</div>
				<div className="text-center mb-7">
					<button
						type="button"
						disabled={activeBtn === "created"}
						onClick={e => {
							setActiveBtn("created");
						}}
						className={`btn-primary ${
							activeBtn === "created" && "btn-active"
						}`}>
						Created
					</button>
					<button
						type="button"
						disabled={activeBtn === "saved"}
						onClick={e => {
							setActiveBtn("saved");
						}}
						className={`btn-primary ${
							activeBtn === "saved" && "btn-active"
						}`}>
						Saved
					</button>
				</div>

				{!pins ? (
					<p>Loading pins...</p>
				) : !pins?.length ? (
					<div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
						No Pins Found!
					</div>
				) : (
					<div className="px-2">
						<MasonryLayout pins={pins} />
					</div>
				)}
			</div>
		</div>
	);
};
export default UserProfile;
