const access_token = "b2e5f7c6b3815f49c9df9523cc57936f7adab22f";
const noOfRepository = 20;

var query = `query ($noOfRepository: Int!) {
	viewer {
	  name
	  login
	  avatarUrl
	  bio
	  followers {
		totalCount
	  }
	  following {
		totalCount
	  }
	  starredRepositories {
		totalCount
	  }
	  repositories(first: $noOfRepository) {
	    totalCount
		nodes {
		  id
		  name
		  createdAt
		  viewerHasStarred
		  forkCount
		  stargazerCount
		  updatedAt
		  description
		  primaryLanguage {
			id
			name
			color
		  }
		}
	  }
	  status {
		emojiHTML
		message
		emoji
	  }
	}
  }`;

var variables = { noOfRepository };

const performQuery = (query, variables, callback) => {
	//check if query has a variable else if not  call without variables value
	const body = variables
		? JSON.stringify({ query, variables })
		: JSON.stringify({ query });

	fetch(`https://api.github.com/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `bearer ${access_token}`,
		},
		body,
	})
		.then((r) => r.json())
		.then((data) => callback(data))
		.catch((error) => {
			throw new Error(error);
		});
};

document.addEventListener("DOMContentLoaded", () => {
	performQuery(query, variables, ({ data }) => {
		injectData(data);
	});
	const injectData = ({ viewer }) => {
		console.log(viewer);
		console.log(viewer.repositories);
		document.querySelector(".avatar").src = viewer.avatarUrl;
		document.querySelector(".rounded_avatar_lg").src = viewer.avatarUrl;
		document.querySelector(".bio").innerHTML = viewer.bio;
		document.querySelector(".rounded_avatar_lg_sec").src = viewer.avatarUrl;
		document.querySelector(".rounded_avatar_sm").src = viewer.avatarUrl;
		document.querySelector(".username_sm").innerHTML = viewer.login;
		document.querySelector(".username").innerHTML = viewer.login;
		document.querySelector(".fullname").innerHTML = viewer.name;
		document.querySelector(".status_emoji").innerHTML = viewer.status.emojiHTML;
		document.querySelector(".main_count").innerHTML =
			viewer.repositories.totalCount;
		document.querySelector(".counter").innerHTML =
			viewer.repositories.totalCount;
		document.querySelector(".emoji").innerHTML = viewer.status.emojiHTML;
		document.querySelector(".status").innerHTML = viewer.status.message;
		viewer.repositories.nodes.map(
			({
				name,
				description,
				updatedAt,
				primaryLanguage,
				forkCount,
				stargazerCount,
			}) => {
				createRepo(
					name,
					description,
					updatedAt,
					primaryLanguage,
					forkCount,
					stargazerCount,
				);
			},
		);
	};
	const createRepo = (
		name,
		description,
		updatedAt,
		primaryLanguage,
		forkCount,
		stargazerCount,
	) => {
		const container = document.querySelector(".repository-container");
		container.innerHTML += `<div class="d-flex repository">
			<div class="col-9">
			<h3 class="repo_name">${name}</h3>
				<div class="col-8 repo_desc_container">
					<p class="repo_description">
					${description ? description : ""}
					</p>
				</div>
				<div class="d-flex info_container">
					<span>
						<span class="color" style="background-color:${primaryLanguage.color}"></span>
						<span>${primaryLanguage.name}</span>
					</span>
					<span>
						<span>
							<svg
								class="octicon octicon-star mr-1"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								height="16"
								aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
							</svg>
						</span>
						<span class="star_count">${stargazerCount}</span>
					</span>
					<span>
						<span>
							<svg
								aria-label="fork"
								class="octicon octicon-repo-forked"
								viewBox="0 0 16 16"
								version="1.1"
								width="16"
								height="16"
								role="img">
								<path
									fill-rule="evenodd"
									d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
							</svg>
						</span>
						<span class="fork_count">${forkCount}</span>
					</span>
					<span>Updated on ${formatTime(updatedAt)}</span>
				</div>
			</div>
			<div class="col-3 star_section">
				<button class="btn-sm">
					<svg
						class="octicon octicon-star mr-1"
						viewBox="0 0 16 16"
						version="1.1"
						width="16"
						height="16"
						aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
					</svg>
					Star
				</button>
			</div>
		</div>`;
	};
});
const formatTime = (dateString) => {
	const options = { day: "numeric", month: "short" };
	return new Date(dateString).toLocaleDateString("en-NG", options);
};
window.addEventListener("scroll", () => {
	if (window.scrollY >= 373 && window.innerWidth >= 786) {
		document.querySelector(".sub_nav_img").style.display = "flex";
	} else {
		document.querySelector(".sub_nav_img").style.display = "none";
	}
});
