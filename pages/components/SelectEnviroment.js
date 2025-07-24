import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SegmentedControl } from "@mantine/core";

const SelectEnviroment = () => {
  const router = useRouter();
  const [selectedEnviroment, setSelectedEnviroment] = useState("staging");

  const handleOptionChange = (value) => {
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
    <SegmentedControl
      value={selectedEnviroment}
      onChange={handleOptionChange}
      data={[
        { label: "Staging", value: "staging" },
        { label: "Live", value: "live" },
      ]}
    />
  );
};

export default SelectEnviroment;
