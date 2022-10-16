/* Save will store data of user who saved the pin and the author of the pin */

export default {
	name: "save",
	title: "Save",
	type: "document",
	fields: [
		{
			name: "postedBy",
			title: "PostedBy",
			type: "postedBy",
		},
		{
			name: "userId",
			title: "UserId",
			type: "string",
		},
	],
};
