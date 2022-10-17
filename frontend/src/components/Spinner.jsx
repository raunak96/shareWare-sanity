import { ReactComponent as Loader } from "../assets/loader.svg";

const Spinner = ({ message }) => {
	return (
		<div className="flex flex-col justify-center items-center h-full w-full fixed inset-0 md:left-32 ">
			<Loader />
			<p className="text-lg text-center px-2">{message}</p>
		</div>
	);
};
export default Spinner;
