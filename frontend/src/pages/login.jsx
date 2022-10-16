import { FcGoogle } from "react-icons/fc";
import video from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import GoogleLogin from "react-google-login";
import { client } from "../sanity.config";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const responseGoogle = async res => {
		try {
			localStorage.setItem("user", JSON.stringify(res.profileObj));
			const { name, googleId, imageUrl } = res.profileObj;
			const doc = {
				_id: googleId,
				_type: "user",
				userName: name,
				avatar: imageUrl,
			};
			await client.createIfNotExists(doc);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="flex flex-col justify-start items-center h-screen">
			<div className="relative w-full h-full">
				<video
					className="h-full w-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
					src={video}
					controls={false}
					autoPlay
					loop
					muted
					type="video/mp4"
				/>
				<div className="absolute h-screen bg-blackOverlay inset-0 flex flex-col justify-center items-center">
					<div className="p-5">
						<img src={logo} alt="logo" width="130px" />
					</div>
					<div className="shadow-2xl">
						<GoogleLogin
							clientId={process.env.REACT_APP_GOOGLE_CID}
							render={renderProps => (
								<button
									className="bg-mainColor flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none"
									type="button"
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}>
									<FcGoogle className="mr-4" /> Sign in with
									Google
								</button>
							)}
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							cookiePolicy="single_host_origin"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
