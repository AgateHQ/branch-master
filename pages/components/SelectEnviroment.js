import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Switch } from "@mantine/core";

const SelectEnviroment = () => {
  const router = useRouter();
  const [selectedEnviroment, setSelectedEnviroment] = useState("staging");

  const handleOptionChange = (checked) => {
    const value = checked ? "live" : "staging";
    setSelectedEnviroment(value);
    localStorage.setItem("selectedEnviroment", value);
    router.reload();
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("selectedEnviroment");
    if (storedValue) {
      setSelectedEnviroment(storedValue);
    }
  }, []);

  return (
    <Switch
      checked={selectedEnviroment === "live"}
      onChange={(event) => handleOptionChange(event.currentTarget.checked)}
      onLabel="Live"
      offLabel="Staging"
      size="lg"
      radius="xl"
    />
  );
};

export default SelectEnviroment;
