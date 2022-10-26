import video from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { GoogleLogin } from "@react-oauth/google";
import { client } from "../sanity.config";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Login = ({ setUserInfo }) => {
	const navigate = useNavigate();
	const login = async res => {
		try {
			const {
				name: userName,
				picture: avatar,
				sub: googleId,
				email,
			} = jwt_decode(`${res.credential}`);

			const doc = {
				_id: googleId,
				_type: "user",
				userName,
				avatar,
				email,
			};
			await client.createIfNotExists(doc);
			setUserInfo({ email });
			navigate("/", { replace: true });
		} catch (error) {
			console.log("Error", error);
			alert("Could not sign you in. Please try again!");
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
					<div className="p-5 flex items-center justify-center gap-2">
						<img src={logo} alt="logo" width="70px" />
						<h1 className="text-white text-3xl">SHAREW@RE</h1>
					</div>
					<div className="shadow-2xl">
						<GoogleLogin
							onSuccess={login}
							onError={() => console.log("Login Failed")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
