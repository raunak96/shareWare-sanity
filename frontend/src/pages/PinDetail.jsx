import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MasonryLayout, Spinner } from "../components";
import { getPinByIdQuery, getPinSuggestionsQuery } from "../queries/pinQueries";
import { client, urlFor } from "../sanity.config";

const PinDetail = ({ user }) => {
	const [pin, setPin] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [pinSuggestions, setPinSuggestions] = useState(null);
	const { pinId } = useParams();
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
	} = useForm();

	useEffect(() => {
		const fetchPinDetails = async () => {
			try {
				const [pinData] =
					(await client.fetch(getPinByIdQuery(pinId))) ?? [];
				setPin(pinData);
				if (pinData) {
					const similarPins = await client.fetch(
						getPinSuggestionsQuery(pinData)
					);
					setPinSuggestions(similarPins);
				}
			} catch (error) {
				console.log("Could not fetch pin details", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPinDetails();
	}, [pinId]);

	const addComment = async ({ comment }) => {
		try {
			const key = uuidv4();
			await client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert("before", "comments[0]", [
					{
						_key: key,
						comment,
						postedBy: {
							_type: "postedBy",
							_ref: user._id,
						},
					},
				])
				.commit();
			setPin(prev => ({
				...prev,
				comments: [
					{
						_key: key,
						postedBy: {
							id: user._id,
							userName: user.userName,
							avatar: user.avatar,
						},
						comment,
					},
					...(prev.comments ?? []),
				],
			}));
			reset();
		} catch (error) {
			console.log("Could not post comment:", error);
		}
	};

	return isLoading ? (
		<Spinner message="Preparing the Pin...." />
	) : Object.keys(pin).length ? (
		<>
			<div className="flex flex-col xl:flex-row m-auto bg-white max-w-[1500px] rounded-[32px]">
				<div className="flex justify-content items-center md:items-start flex-initial p-2">
					<img
						className="rounded-t-3xl rounded-b-lg w-full object-cover"
						src={pin?.image && urlFor(pin?.image).url()}
						alt="user-post"
					/>
				</div>
				<div className="w-full px-5 py-2 flex-1 xl:min-w-620">
					<div className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<a
								href={`${pin.image.asset.url}?dl=`}
								download
								className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100">
								<MdDownloadForOffline />
							</a>
						</div>
						<a
							href={pin.destination}
							target="_blank"
							rel="noreferrer">
							Source{" : "}
							<span className="underline italic">
								{pin.destination.length < 20
									? pin.destination
									: `${pin.destination.slice(8, 30)}...`}
							</span>
						</a>
					</div>
					<div>
						<h1 className="text-3xl font-bold break-words mt-3">
							{pin.title}
						</h1>
						<p className="mt-3">{pin.about}</p>
					</div>
					<Link
						to={`/user-profile/${pin?.postedBy._id}`}
						className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
						<img
							src={pin?.postedBy.avatar}
							className="w-10 h-10 rounded-full"
							alt="user-profile"
						/>
						<p className="font-bold">{pin?.postedBy.userName}</p>
					</Link>
					<h2 className="mt-5 text-2xl">Comments</h2>
					<div className="flex flex-wrap mt-6 gap-3 items-center">
						<Link to={`/user-profile/${user._id}`}>
							<img
								src={user.avatar}
								className="w-10 h-10 rounded-full cursor-pointer"
								alt="user-profile"
							/>
						</Link>
						<form
							onSubmit={handleSubmit(addComment)}
							className="contents">
							<input
								{...register("comment", {
									required: "Field cant be empty",
								})}
								className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
								type="text"
								placeholder="Add a comment"
							/>
							<button
								type="submit"
								disabled={
									isSubmitting || errors?.comment?.message
								}
								className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none disabled:opacity-50 disabled:cursor-not-allowed">
								{isSubmitting ? "Commenting..." : "Comment"}
							</button>
						</form>
					</div>
					<div className="max-h-370 overflow-y-auto">
						{pin?.comments?.map(item => (
							<div
								className="flex gap-2 mt-5 items-center bg-white rounded-lg"
								key={item.comment}>
								<img
									src={item.postedBy?.avatar}
									className="w-10 h-10 rounded-full cursor-pointer"
									alt="user-profile"
								/>
								<div className="flex flex-col">
									<p className="font-bold">
										{item.postedBy?.userName}
									</p>
									<p>{item.comment}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{pinSuggestions?.length > 0 && (
				<h2 className="text-center font-bold text-2xl mt-8 mb-4">
					Here are some more suggestions for you
				</h2>
			)}
			{pinSuggestions ? (
				<MasonryLayout pins={pinSuggestions} />
			) : (
				<Spinner message="Loading more pins" />
			)}
		</>
	) : (
		<p>Could not fetch the Pin details. Please try again later.</p>
	);
};
export default PinDetail;
