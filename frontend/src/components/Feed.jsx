import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, MasonryLayout } from ".";
import { feedQuery, searchPins } from "../queries/pinQueries";
import { client } from "../sanity.config";

const Feed = ({ user }) => {
	const [pins, setPins] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { categoryName } = useParams();

	useEffect(() => {
		const fetchPins = async () => {
			setIsLoading(true);
			try {
				const query = categoryName
					? searchPins(categoryName)
					: feedQuery;
				const data = await client.fetch(query);
				setPins(data);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPins();
	}, [categoryName]);

	return isLoading ? (
		<Spinner message="We are adding new ideas for your feed." />
	) : pins?.length ? (
		<MasonryLayout pins={pins} setPins={setPins} user={user} />
	) : (
		<p className="text-center text-xl">No Pins Yet</p>
	);
};
export default Feed;
