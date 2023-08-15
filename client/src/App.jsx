import axios from "axios";
import { useState, useEffect } from "react";
import { RadioButton } from "primereact/radiobutton";

function App() {
  const [slackMessage, setSlackMessage] = useState("");
  const [telegramChannelId, setTelegramChannelId] = useState("");
  const [telegramMessage, setTelegramMessage] = useState("");
  const [installations, setInstallations] = useState(null);
  const [selectedInstallation, setSelectedInstallation] = useState(null);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await axios.get("/api/installations");
        setInstallations(response.data);
      } catch (error) {
        console.log("error fetching installations: ", error.message);
      }
    };
    fetchInstallations();
  }, []);

  let installationElements;
  if (installations) {
    installationElements = installations.map((installation) => {
      return (
        <div key={installation._id}>
          <RadioButton
            inputId={installation._id}
            name="installation"
            value={installation}
            onChange={(e) => setSelectedInstallation(e.value)}
            checked={selectedInstallation?._id === installation?._id}
          />
          <label htmlFor={installation._id}>{installation.team.name}</label>
        </div>
      );
    });
  }

  const sendSlackMessage = async () => {
    try {
      await axios.post("/api/slack/messages", {
        message: slackMessage,
        incomingWebhook: selectedInstallation.incomingWebhook,
      });
    } catch (error) {
      console.log("error generating notification: ", error);
    }
  };

  const sendTelegramMessage = async () => {
    try {
      await axios.post("/api/telegram/messages", {
        channelId: telegramChannelId,
        message: telegramMessage,
      });
    } catch (error) {
      console.log("error generating notification: ", error);
    }
  };

  return (
    <>
      <h1>Notification Testing </h1>
      <hr />
      <h2>Telegram</h2>
      <p>
        If you do not know your Channel ID, you can find it by opening the
        channel in Telegram's web client. It's the "-XXXXXXXXXX" in the URL
        where X is a number. The "-" is important. You must also add "100"
        between the "-" and the X's. You can also find your Channel ID just by
        forwarding a message to @getidsbot. This is more consistent and is
        recommended.
      </p>
      <p>
        Before the bot can send messages to the channel, you must add the bot
        "@botname" as an admin to the channel with permission to post messages.
      </p>
      <label>
        <b>Channel ID</b>
        <br />
        <input
          value={telegramChannelId}
          onChange={(e) => setTelegramChannelId(e.target.value)}
        ></input>
      </label>
      <br />
      <br />
      <label>
        <b>Message</b>
        <br />
        <input
          value={telegramMessage}
          onChange={(e) => setTelegramMessage(e.target.value)}
        ></input>
      </label>
      <br />
      <br />
      <button onClick={sendTelegramMessage}>Send</button>
      <hr></hr>
      <h2>Slack</h2>
      <p>Click 'Add to Slack' to install app to a workspace</p>
      <a href="https://slack.com/oauth/v2/authorize?client_id=1695294461842.5742429106352&scope=incoming-webhook">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
      <br />
      <br />
      <b>Select which installation you'd like to message</b>
      <br />

      {installationElements ? installationElements : "No installations yet"}
      <br />
      <br />
      <label>
        <b>Message</b>
        <br />
        <input
          value={slackMessage}
          onChange={(e) => setSlackMessage(e.target.value)}
        ></input>
      </label>
      <br />
      <br />
      <button onClick={sendSlackMessage}>Send</button>
    </>
  );
}

export default App;
