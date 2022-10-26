export const getUserQuery = userId => `*[_type=="user" && _id=="${userId}"]{
    _id,
    userName,
    avatar
}`;

export const getCurrentUserQuery = email =>
	`*[_type=="user" && email=="${email}"]`;

export const getUserCreatedPinsQuery = userId => {
	const query = `*[_type=="pin" && userId == '${userId}']| order(_createdAt desc){
         image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      avatar
    },
    save[]{
      postedBy->{
        _id,
        userName,
        avatar
      },
    },
    }`;
	return query;
};

export const getUserSavedPinsQuery = userId => {
	const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      avatar
    },
    save[]{
      postedBy->{
        _id,
        userName,
        avatar
      },
    },
  }`;
	return query;
};
