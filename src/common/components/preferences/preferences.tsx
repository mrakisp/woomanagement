import React, { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import BasicModal from "../modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import Switch from "@mui/material/Switch";
import preferencesStore from "../../../store/preferencesStore";
import styled from "styled-components";

interface PreferencesProps {
  visible?: boolean;
}

const Settings = styled.div`
  margin-left: auto;
  margin-top: 10px;
  margin-right: 25px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  & span{
    font-size: 12px;
  }
}
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;

  & span.title {
      min-width: 110px;
      display: inline-flex;
  }
}
`;

export default function Preferences({ visible }: PreferencesProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [preferences, setPreferences] = useLocalStorage<string>(
    "preferences",
    JSON.parse(
      JSON.stringify({
        showWeight: false,
        showFeatured: true,
        showSlug: true,
        autoGenSku: false,
      })
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
      <ModalContainer>
        <div>
          <span className="title">Show Weight </span>
          <Switch
            value="showWeight"
            onChange={handleChange}
            checked={JSON.parse(JSON.stringify(preferences)).showWeight}
          />
        </div>
        <div>
          <span className="title">Show Slug </span>
          <Switch
            value="showSlug"
            onChange={handleChange}
            checked={JSON.parse(JSON.stringify(preferences)).showSlug}
          />
        </div>
        <div>
          <span className="title">Auto Generate Variations Sku</span>
          <Switch
            value="autoGenSku"
            onChange={handleChange}
            checked={JSON.parse(JSON.stringify(preferences)).autoGenSku}
          />
        </div>
      </ModalContainer>
    );
  };

  return (
    <>
      {visible && (
        <>
          <Settings>
            <SettingsIcon onClick={handleOpen} />
            <span>Show/Hide Fields</span>
          </Settings>

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
