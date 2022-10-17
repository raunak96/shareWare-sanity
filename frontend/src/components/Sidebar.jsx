import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";

const isNotActiveStyle =
	"flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
	"flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";

const categories = [
	{ name: "Animals" },
	{ name: "Cars" },
	{ name: "Gaming" },
	{ name: "Anime" },
];
const Sidebar = ({ user, closeToggle }) => {
	const handleCloseSidebar = () => closeToggle && closeToggle(false);
	return (
		<div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
			<div className="flex flex-col">
				<Link
					to="/"
					className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
					onClick={handleCloseSidebar}>
					<img src={logo} alt="logo" className="w-full" />
				</Link>
				<div className="flex flex-col gap-5">
					{/* end prop in NavLink ensures that Home is not set to Active when its child route is Active */}
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
						end>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className="mt-2 px-5 text-base xl:text-xl">
						Discover categories
					</h3>
					{categories
						.slice(0, categories.length - 1)
						.map((category, ind) => (
							<NavLink
								to={`/category/${category.name}`}
								className={({ isActive }) =>
									isActive ? isActiveStyle : isNotActiveStyle
								}
								onClick={handleCloseSidebar}
								key={ind}>
								{/* <img
									src={category.image}
									className="w-8 h-8 rounded-full shadow-sm"
									alt={category.name}
								/> */}
								{category.name}
							</NavLink>
						))}
				</div>
			</div>
			{user && (
				<Link
					to={`user-profile/${user._id}`}
					className="flex space-x-4 my-5 mb-3 mx-3 items-center p-2 bg-white rounded-lg shadow-lg"
					onClick={handleCloseSidebar}>
					<img
						src={user.avatar}
						alt="Profile"
						className="h-10 w-10 rounded-full"
					/>
					<p>{user.userName}</p>
					<IoIosArrowForward />
				</Link>
			)}
		</div>
	);
};
export default Sidebar;
