import Masonry from "react-masonry-css";
import { Pin } from ".";

const breakPoints = {
	default: 4,
	3000: 6,
	2000: 5,
	1500: 4,
	1200: 3,
	840: 2,
	540: 1,
};

const MasonryLayout = ({ pins, setPins, user }) => {
	return (
		<Masonry
			className="flex animate-slide-fwd"
			breakpointCols={breakPoints}>
			{pins?.map(pin => (
				<Pin
					key={pin._id}
					pin={pin}
					setPins={setPins}
					user={user && user}
					className="w-max"
				/>
			))}
		</Masonry>
	);
};
export default MasonryLayout;
