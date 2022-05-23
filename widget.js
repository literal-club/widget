const target = document.querySelector("#literal-widget");
const variables = {
  handle: target.getAttribute("handle"),
  readingStatus: target.getAttribute("status"),
  layout: target.getAttribute("layout"),
  limit: target.getAttribute("limit"),
};
fetch("https://literal.club/graphql/", {
  method: "POST",
  mode: "cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `
        query getProfileReadingStatesByHandle($handle: String!, $readingStatus: ReadingStatus!, $first: Int) {
	            profile(where: { handle: $handle }) {
	                id
	                readingStates(
		                first: $first
		                where: {
		                	latest: {
		                		equals: true
		                	},
		                	status: {
		                		equals: $readingStatus
		                	}
		                }
		                orderBy: {
		                	createdAt: desc
		                }
	                ) {
	                	...ReadingStateParts
		                book {
		                    ...BookParts
		                    __typename
		                }
	                	__typename
	                }
	                __typename
	            }
            }

            fragment ReadingStateParts on ReadingState {
	            id
	            status
	            bookId
	            profileId
	            createdAt
	            __typename
            }

            fragment BookParts on Book {
	            id
	            slug
	            title
	            subtitle
	            description
	            isbn10
	            isbn13
	            language
	            pageCount
	            publishedDate
	            publisher
	            physicalFormat
	            cover
	            authors {
	                id
	                name
	                __typename
	            }
	            gradientColors
	            workId
	            __typename
            }
	    `,
    variables,
  }),
})
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    const books = response.data.profile.readingStates.map((r) => r.book);
    const formatter = new Intl.ListFormat("en", {
      style: "short",
      type: "conjunction",
    });
    const bookItems = books.map((book) => {
      const authors = formatter.format(book.authors.map((a) => a.name));
      const bookItem = document.createElement("div");
      bookItem.classList.add("literal-book-item");
      bookItem.innerHTML = `
			<a href="https://literal.club/${variables.handle}/book/${book.slug}" target="_blank">
				<div class="literal-book-item__inner">
					<div class="literal-book-item__image">
						<div class="literal-book-item__image_cover__outer">
							<img src="${book.cover}" alt="${book.title}" />
						</div>
					</div>
					<div class="literal-book-item__info">
						<div class="literal-book-item__title">
							${book.title}
						</div>
						<div class="literal-book-item__authors">
							${authors}
						</div>
					</div>
				</div>
			</a>
		`;
      return bookItem;
    });
    target.append(...bookItems);
  });
var list = `
    #literal-widget .literal-book-item {
        display: flex;
        text-align: left;
        position: relative;
        transition: all .2s linear;
    }
    #literal-widget .literal-book-item:hover {
    	border-color: #e1dddd;
    	z-index: 1;
    }
    #literal-widget .literal-book-item a {
    	width: 100%;
    	display: flex;
    	padding: 10px 10px 10px 0;
    }
    #literal-widget .literal-book-item__inner {
    	flex: 1 0;
	    display: flex;
	    align-items: center;
    }
    #literal-widget .literal-book-item__image {
        width: 40px;
        flex: 0 0 40px;
        align-self: flex-start;
        height: 64px;
        display: flex;
        align-items: center;
        margin-right: 23px;
    }
    #literal-widget .literal-book-item__image_cover__outer {
    	position: relative;
	    display: inline-block;
	    line-height: 100%;
	}
    #literal-widget .literal-book-item__image_cover__outer img {
    	user-select: none;
	    width: auto;
	    height: auto;
	    max-width: 100%;
	    max-height: 100%;
        border-top-left-radius: 1px;
        border-bottom-left-radius: 1px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        filter: drop-shadow(0 calc((0 + 0) * 2px) calc((5 + 0) * 2px) rgba(0,0,0,calc((1.5 + 0) * .03)));
        border: 1px solid #f5f5f5;
	    display: inline-block;
	    vertical-align: middle;
	    -webkit-transform: translateZ(0);
    }
    #literal-widget .literal-book-item__info {
    	flex: 1 0;
    }
    #literal-widget .literal-book-item__title {
        font-weight: 400;
        color: #000000;
    	font-size: 14px;
    	line-height: 150%;
    }
    #literal-widget .literal-book-item__authors {
    	font-size: 14px;
    	color: #9a988b;
    	line-height: 145%;
    	margin-top: 4px;
    }
`;
var row = `
	 #literal-widget {
	 	display: flex;
	 }
     #literal-widget .literal-book-item { 
     	max-width: 50px;
        display: flex;
        align-self: flex-end;
        margin-right: 20px;
        text-align: left;
        position: relative;
        transition: all .2s linear;
    }
    #literal-widget .literal-book-item__image_cover__outer img {
    	user-select: none;
        border-top-left-radius: 1px;
        border-bottom-left-radius: 1px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        filter: drop-shadow(0 calc((0 + 0) * 2px) calc((5 + 0) * 2px) rgba(0,0,0,calc((1.5 + 0) * .03)));
        border: 1px solid #f5f5f5;
	    display: inline-block;
	    -webkit-transform: translateZ(0);
    }
    #literal-widget .literal-book-item__info {
    	display: none;
    }
`;
var styleSheet = document.createElement("style");
styleSheet.innerText = list;
document.head.appendChild(styleSheet);
