import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
	const navigate = useNavigate();
	return (
		user && (
			<div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
				<div className="flex justify-start items-center w-full px-2 rounded-md bg-white  shadow-sm focus-within:shadow-md">
					<IoMdSearch fontSize={21} className="ml-1" />
					<input
						placeholder="Search"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onFocus={() => navigate("/search")}
						className="p-3 w-full bg-white outline-none"
					/>
				</div>
				<div className="flex gap-3">
					<Link
						to={`user-profile/${user?._id}`}
						className="hidden md:block">
						<img
							src={user.avatar}
							alt="avatar"
							className="w-14 h-12 rounded-lg"
						/>
					</Link>
					<Link
						to="/create-pin"
						className="flex justify-center items-center bg-black text-white rounded-lg w-12 h-12 md:w-14">
						<IoMdAdd />
					</Link>
				</div>
			</div>
		)
	);
};
export default Navbar;
