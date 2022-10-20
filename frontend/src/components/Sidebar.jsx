import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/logo.webp";
import { Link, NavLink } from "react-router-dom";
import categories from "../utils/categories";

const isNotActiveStyle =
	"flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
	"flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
	const handleCloseSidebar = () => closeToggle && closeToggle(false);
	return (
		<div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
			<div className="flex flex-col">
				<Link
					to="/"
					className="flex px-5 gap-y-2 my-6 pt-1 w-190 items-center"
					onClick={handleCloseSidebar}>
					<img src={logo} alt="logo" className="w-2/3" />
					<h2 className="text-red-500 font-bold -ml-2">ShareW@re</h2>
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
					<hr className="w-4/5 mx-auto" />
					{categories
						.slice(0, categories.length - 1)
						.map(({ name, image }, ind) => (
							<NavLink
								to={`/category/${name}`}
								className={({ isActive }) =>
									isActive ? isActiveStyle : isNotActiveStyle
								}
								onClick={handleCloseSidebar}
								key={`${name}-${ind}`}>
								{/* <img
									src={category.image}
									className="w-8 h-8 rounded-full shadow-sm"
									alt={name}
								/> */}
								<img
									src={image}
									alt={name}
									className="w-8 h-8 rounded-full shadow-sm "
								/>
								{name}
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
