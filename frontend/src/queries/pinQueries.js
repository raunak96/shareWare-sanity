/* For understanding how text matching in Sanity GROG works: refer https://www.sanity.io/docs/query-cheat-sheet#170b92d4caa2 
    Basically our 1st query returns all pins whose title/category/about starts with the "searchTerm" word.

    But we don't want each and every field, so we can project the fields we want (This property is similar to GQL and advantage over REST).
    In our Case, the fields of each pin we want are: [For Docs refer: https://www.sanity.io/docs/how-queries-work]
    1. _id , 2. image [image is a special Sanity type which has an asset reference field and form that we just want the url field hence the given syntax used]. -> is dereferencing operator which allows to populate the fields of reference otherwise only reference id is returned (in our case, we wanted url from asset),
    3. destination, 4.postedBy(since it is ref, we dereferenced the required fields from it),
    5. save (since it is an array,we add [] after the name and from that we want only postedBy and key which is unique for array element generated by Sanity, hence _ before it).
*/

// Get Pins whose category/title/about field start with given searchTerm
export const searchPinsQuery = searchTerm => {
	const query = `*[_type=="pin" && title match "${searchTerm}*" || category match "${searchTerm}*" || about match "${searchTerm}*"]{
            _id,
            image{
                asset->{
                    url
                }
            },
            destination,
            postedBy->{
                _id,
                userName,
                avatar
            },
            save[]{
                _key,
                postedBy->{
                    _id,
                    userName,
                    avatar
                },
            },
        }`;
	return query;
};

// Get all Pins
export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    _id,
  image{
    asset-> {
      url
    }
  },
      destination,
      postedBy->{
        _id,
        userName,
        avatar
      },
      save[]{
        _key,
        postedBy->{
          _id,
          userName,
          avatar
        },
      },
    } `;

// Get Pin by id
export const getPinByIdQuery = pinId => {
	const query = `*[_type=="pin" && _id=="${pinId}"]{
         image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
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
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        avatar
      },
    }
    }`;
	return query;
};

// Get Pins similar to given Pin (similarity based on Category)
export const getPinSuggestionsQuery = pin => {
	const query = `*[_type=="pin" && category=="${pin.category}" && _id!="${pin._id}"]{
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
            _key,
            postedBy->{
                _id,
                userName,
                avatar
            },
        },
    }`;
	return query;
};
