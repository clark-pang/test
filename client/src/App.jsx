import axios from "axios";
import { useState, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";

function App() {
  const [text, setText] = useState("");
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        const users = response.data;
        setUsers(users);
      } catch (error) {
        console.log("error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  let userElements;
  if (users) {
    userElements = users.map((user) => {
      return (
        <div key={user._id}>
          <RadioButton
            inputId={user._id}
            name="user"
            value={user}
            onChange={(e) => setSelectedUser(e.value)}
            checked={selectedUser?._id === user?._id}
          />
          <label htmlFor={user._id}>{user.team.name}</label>
        </div>
      );
    });
  }

  const generateNotification = async () => {
    try {
      await axios.post("/api/notifications:generate", {
        text,
        incomingWebhook: selectedUser.incomingWebhook,
      });
    } catch (error) {
      console.log("error generating notification: ", error);
    }
  };

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)}></input>
      <button onClick={generateNotification}>Notify</button>
      <a href="https://slack.com/oauth/v2/authorize?client_id=1695294461842.5742429106352&scope=incoming-webhook">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
      {userElements}
    </>
  );
}

export default App;
