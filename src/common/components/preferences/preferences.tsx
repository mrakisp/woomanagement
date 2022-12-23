import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import BasicModal from "../modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import Switch from "@mui/material/Switch";
import preferencesStore from "../../../store/preferencesStore";

interface PreferencesProps {
  visible?: boolean;
}

export default function Preferences({ visible }: PreferencesProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [preferences, setPreferences] = useLocalStorage<string>(
    "preferences",
    JSON.parse(
      JSON.stringify({ showWeight: true, showFeatured: true, showSlug: true })
    )
  );

  const handleChange = (switchVal: any) => {
    const updatedPreferences = JSON.parse(JSON.stringify(preferences));
    updatedPreferences[switchVal.target.value] = switchVal.target.checked
      ? true
      : false;
    setPreferences(updatedPreferences);
    preferencesStore.setPreferences(updatedPreferences);
  };

  const Preferences = () => {
    return (
      <>
        Show Weight{" "}
        <Switch
          value="showWeight"
          onChange={handleChange}
          checked={JSON.parse(JSON.stringify(preferences)).showWeight}
        />
        Show Slug{" "}
        <Switch
          value="showSlug"
          onChange={handleChange}
          checked={JSON.parse(JSON.stringify(preferences)).showSlug}
        />
      </>
    );
  };

  return (
    <>
      {visible && (
        <>
          <SettingsIcon onClick={handleOpen} />
          <BasicModal
            component={<Preferences />}
            open={open}
            handleClose={handleClose}
          />
        </>
      )}
    </>
  );
}
