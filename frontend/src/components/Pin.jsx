import { client, urlFor } from "../sanity.config";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Pin = ({ pin, setPins, user }) => {
	const { image, _id, destination, save, postedBy } = pin;
	console.log(postedBy);
	const [isAlreadySaved, setIsAlreadySaved] = useState(
		!!save?.find(save => save.postedBy?._id === user?._id)
	);
	const buttonRef = useRef();
	const navigate = useNavigate();

	const savePin = async e => {
		e.stopPropagation();
		buttonRef.current.innerText = "Saving";
		buttonRef.current.disabled = true;
		try {
			/* Patch method is used to update document in Sanity. Ou query goes like this, We want patch a doc with given id in this case pin id, if field we want to add is not set in our case it is possible initially save array is null, so we first set it to empty array using setIfMissing. Then we want insert our save at end of save array, so we do {after save[-1]} -> save[-1] points to current last element and we want to insert after it. Finally we pass in our data which is passed as array as we are allowed to add more than 1 element to array. Finally commit sends our req for patch to backend and returns updated doc (only 1st element in case we passed more than 1 element to insert)  */

			const key = uuidv4();
			await client
				.patch(_id)
				.setIfMissing({ save: [] })
				.insert("after", "save[-1]", [
					{
						_key: key,
						userId: user._id,
						postedBy: {
							_type: "postedBy",
							_ref: user._id,
						},
					},
				])
				.commit();
			setPins(prev =>
				prev.map(p =>
					p._id === _id
						? {
								...p,
								save: [
									...(p.save ?? []),
									{ _key: key, postedBy },
								],
						  }
						: p
				)
			);
			setIsAlreadySaved(true);
		} catch (error) {
			console.log("Error", error);
			buttonRef.current.innerText = "Save";
			buttonRef.current.disabled = false;
		}
	};

	const deletePin = async e => {
		e.stopPropagation();
		try {
			await client.delete(_id);
			setPins(prev => prev.filter(p => p._id !== _id));
		} catch (error) {
			console.log("Error", error);
		}
	};
	return (
		<div className="w-max">
			<div className="m-2">
				<div
					onClick={() => navigate(`/pin-detail/${_id}`)}
					className="group relative cursor-zoom-in w-auto hover:shadow-xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out">
					{/* urlFor is a sanity function which first optimizes the image for passed options in our case width and then returns its url  */}
					<img
						className="rounded-lg w-full"
						alt="user-post"
						src={urlFor(image).width(250).url()}
					/>
					<div className="hidden group-hover:flex flex-col justify-between absolute top-1 w-full h-full p-1 pr-2 py-2 z-50">
						<div className="flex items-center justify-between">
							<div className="flex gap-2">
								{/* ?dl is sanity way of downloading image */}
								<a
									href={`${image?.asset?.url}?dl=`}
									onClick={e => e.stopPropagation()}
									className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
									<MdDownloadForOffline />
								</a>
							</div>
							{isAlreadySaved ? (
								<button
									type="button"
									className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
									Saved
								</button>
							) : (
								<button
									type="button"
									ref={buttonRef}
									onClick={savePin}
									className="bg-red-500 disabled:opacity-50 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none ">
									Save
								</button>
							)}
						</div>
						<div className=" flex justify-between items-center gap-2 w-full">
							{destination && (
								<a
									href={destination}
									target="_blank"
									onClick={e => e.stopPropagation()}
									className="bg-white w-4/5 flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md "
									rel="noreferrer">
									<p className="break-words text-ellipsis overflow-hidden whitespace-nowrap">
										{destination.slice(8)}
									</p>
								</a>
							)}
							{postedBy?._id === user?._id && (
								<button
									type="button"
									onClick={deletePin}
									className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none">
									<AiTwotoneDelete color="red" />
								</button>
							)}
						</div>
					</div>
				</div>
				<div className="flex justify-between items-center mt-2">
					<Link
						to={`/user-profile/${postedBy?._id}`}
						className="flex gap-2 items-center">
						<img
							className="w-8 h-8 rounded-full object-cover"
							src={postedBy?.avatar}
							alt="user-profile"
						/>
						<p className="font-semibold capitalize">
							{postedBy?.userName}
						</p>
					</Link>
					{save?.length && <p>{save.length} Saves</p>}
				</div>
			</div>
		</div>
	);
};
export default Pin;
