"use client";
import Header from "@/components/Header";
import React, { useState } from "react";
import  { Divider } from "@mui/material";
import SettingsForm from "@/components/PersonalImgPicker";
const Settings = () => {
  return (
    <div className="p-8 flex flex-col gap-4">
      <Header name="Personal Information" />
      <Divider />
      <SettingsForm />
    </div>
  );
};

export default Settings;
