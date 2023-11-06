import ThemeManager from "../../containers/ThemeManager";
import ServerStatusComponent from "../../containers/ServerStatus";

const Settings = () => {
  return (
    <div>
      <div>Settings</div>
      <hr />
      <ThemeManager />
      <hr />
      <ServerStatusComponent />
    </div>
  );
};

export default Settings;
