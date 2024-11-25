import { Octokit } from "https://esm.sh/@octokit/core";

const octokit = new Octokit({ auth: "YOUR_GITHUB_TOKEN" });

async function getCurrentUser() {
  const { data } = await octokit.request("GET /user");
  return data.login;
}

async function getFollowers(username: string): Promise<string[]> {
  const response = await octokit.request("GET /users/{username}/followers", {
    username,
    per_page: 100,
  });
  return response.data.map((follower: any) => follower.login);
}

async function getFollowing(username: string): Promise<string[]> {
  const response = await octokit.request("GET /users/{username}/following", {
    username,
    per_page: 100,
  });
  return response.data.map((following: any) => following.login);
}

async function main() {
  const username = await getCurrentUser();
  console.log(`Authenticated as: ${username}`);

  const followers = await getFollowers(username);
  const following = await getFollowing(username);

  // Follow back logic remains the same
  for (const follower of followers) {
    if (!following.includes(follower)) {
      await octokit.request("PUT /user/following/{username}", {
        username: follower,
      });
      console.log(`Followed back: ${follower}`);
    }
  }

  // Unfollow logic remains the same
  for (const followedUser of following) {
    if (!followers.includes(followedUser)) {
      await octokit.request("DELETE /user/following/{username}", {
        username: followedUser,
      });
      console.log(`Unfollowed: ${followedUser}`);
    }
  }
}

main().catch(console.error);
