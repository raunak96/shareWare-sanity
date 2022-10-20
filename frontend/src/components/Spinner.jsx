import { ReactComponent as Loader } from "../assets/loader.svg";

const Spinner = ({ message, color = "black", isLoader = true }) => {
	return (
		<div className="flex flex-col justify-center items-center h-full w-full fixed inset-0 md:left-32 ">
			{isLoader && <Loader style={{ fill: color }} />}
			<p className="text-xl mt-2 text-center px-2" style={{ color }}>
				{message}
			</p>
		</div>
	);
};
export default Spinner;
