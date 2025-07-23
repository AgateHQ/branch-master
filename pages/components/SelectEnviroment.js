import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const SelectEnviroment = () => {
  const router = useRouter();
  const [selectedEnviroment, setSelectedEnviroment] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // Options for the select dropdown
  const options = [
    { value: "staging", label: "Staging" },
    { value: "live", label: "Live" },
  ];

  // Function to handle option change
  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedEnviroment(selectedValue);
    localStorage.setItem("selectedEnviroment", selectedValue);
    router.reload(); // Trigger page reload
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("selectedEnviroment");
    if (storedValue) {
      setSelectedOption(storedValue);
    }
  }, []);

  return (
    <div>
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectEnviroment;
