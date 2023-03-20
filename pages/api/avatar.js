async function getToken() {
  try {
    const response = await fetch(
      `https://api.yfl.es/v1/settings/twitch/token`,
      {
        headers: {
          "Content-type": "application/json",
          clientID: process.env.YFL_CLIENT_ID,
          token: process.env.YFL_TOKEN,
        },
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      return data.value;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export default async function get(req, res) {
  const { query } = req;
  const { avatar } = query;

  if (!avatar) {
    return res.status(500).json({ message: "empty inputs" });
  }

  const token = await getToken();

  if (token === null) {
    return res.status(500).json({ message: "twitch api error" });
  }

  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/users?login=${avatar}`,
      {
        headers: {
          "Content-type": "application/json",
          "Client-ID": process.env.CLIENT_ID,
          Authorization: "Bearer "+token,
        },
      }
    );
    const data = await response.json();

    if(response.status === 200){
        const {profile_image_url, display_name, created_at} = data.data[0]
        return res.status(response.status).json({
            avatar: profile_image_url,
            nick: display_name,
            created_at: created_at
        });
    }
    
    return res.status(500).json("Coś poszło nie tak");
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
}