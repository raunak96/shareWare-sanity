import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Spinner } from "../components";
import { useState } from "react";
import categories from "../utils/categories";
import { client } from "../sanity.config";

const CreatePin = ({ user }) => {
	const [imageSrc, setImageSrc] = useState(null);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		clearErrors,
		resetField,
		formState: { errors, isSubmitting },
	} = useForm();
	const onSubmit = async data => {
		const { imageUpload, title, about, destination, category } = data;
		let imageAsset;
		/* First Upload Image to Sanity (which stores it as imageAsset) and get their generated URL */
		try {
			const file = imageUpload;
			const { type, name } = file;
			imageAsset = await client.assets.upload("image", file, {
				contentType: type,
				filename: name,
			});
		} catch (error) {
			console.log("Image Upload failed");
			return;
		}
		/* Now create the pin including the above imageAsset */
		const doc = {
			_type: "pin",
			title,
			about,
			destination,
			category,
			image: {
				_type: "image",
				asset: {
					_type: "reference",
					_ref: imageAsset?._id,
				},
			},
			userId: user._id,
			postedBy: {
				_type: "postedBy",
				_ref: user._id,
			},
		};
		try {
			await client.create(doc);
			navigate("/");
		} catch (error) {
			console.log("Could not create a new pin", error);
		}
	};
	const handleImageChange = e => {
		const file = e.target.files[0];
		const fileType = file.type;
		if (!fileType.includes("image")) {
			setError("imageUpload", {
				type: "fileType",
				message: "Only image files are allowed",
			});
			resetField("imageUpload");
		} else {
			clearErrors("imageUpload");
			var reader = new FileReader();
			reader.onload = function (e) {
				setImageSrc(e.target.result);
			};
			reader.readAsDataURL(file);
			setValue("imageUpload", file);
		}
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
			{Object.keys(errors).length > 0 &&
				errors?.imageUpload?.type !== "fileType" && (
					<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
						Please add all fields.
					</p>
				)}
			<div className="flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 w-full lg:w-4/5">
				{/* Image Upload  */}
				<div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
					<div className=" flex flex-col justify-center items-center  border-2 border-dotted border-gray-300 p-3 w-full h-420">
						{isSubmitting && <Spinner />}
						{errors?.imageUpload?.type === "fileType" && (
							<p className="text-center">
								{errors?.imageUpload.message}
							</p>
						)}
						{!imageSrc ? (
							<label htmlFor="imageUpload">
								<div className="flex flex-col items-center justify-center h-full">
									<div className="flex flex-col justify-center items-center">
										<p className="font-bold text-2xl">
											<AiOutlineCloudUpload />
										</p>
										<p className="text-lg">
											Click to upload
										</p>
									</div>
									<p className="mt-32 text-gray-400">
										Recommendation: Use high-quality JPG,
										JPEG, SVG, PNG, GIF or TIFF less than
										20MB
									</p>
								</div>
								<input
									type="file"
									{...register("imageUpload", {
										required: true,
									})}
									accept="image/*"
									id="imageUpload"
									onChange={handleImageChange}
									className="w-0 h-0"
								/>
							</label>
						) : (
							<div className="relative h-full w-full">
								<img
									src={imageSrc}
									alt="uploaded-pic"
									className="h-full w-full object-cover"
								/>
								<button
									type="button"
									className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
									onClick={e => {
										setImageSrc(null);
										resetField("imageUpload");
									}}>
									<MdDelete />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Other Inputs */}
				<div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full ">
					<input
						type="text"
						{...register("title", { required: true })}
						placeholder="Add your title"
						className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 focus:shadow-sm"
					/>
					<div className="flex items-center gap-2 mt-2 mb-2  bg-white rounded-lg ">
						<img
							src={user?.avatar}
							className="w-10 h-10 rounded-full"
							alt="user-profile"
						/>
						<p className="font-bold">{user?.userName}</p>
					</div>
					<textarea
						rows={1}
						{...register("about", { required: true })}
						placeholder="Tell everyone what your Pin is about"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 overflow-hidden focus:shadow-sm"></textarea>
					<input
						type="url"
						{...register("destination", { required: true })}
						placeholder="Add a destination link"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 invalid:border-pink-500 invalid:text-pink-600"
					/>
					<div className="flex flex-col mt-2">
						<div>
							<p className="mb-2 font-semibold text:lg sm:text-xl">
								Choose Pin Category
							</p>
							<select
								{...register("category", {
									required: true,
								})}
								className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer">
								<option
									value="others"
									className="sm:text-bg bg-white">
									Select Category
								</option>
								{categories.map((item, ind) => (
									<option
										key={`${item.name}-${ind}`}
										className="text-base border-0 outline-none capitalize bg-white text-black "
										value={item.name}>
										{item.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex justify-end items-end mt-5">
							<button
								type="submit"
								className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none">
								Save Pin
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};
export default CreatePin;
