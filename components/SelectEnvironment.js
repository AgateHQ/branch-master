import { useAxateEnvironment } from "./AxateEnvironment";

const options = [
  { value: "staging", label: "Staging" },
  { value: "live", label: "Live" },
];

export default function SelectEnvironment() {
  const { environment, selectEnvironment } = useAxateEnvironment();

  return (
    <label>
      <span className="visually-hidden">Axate environment</span>
      <select
        aria-label="Axate environment"
        value={environment}
        onChange={(event) => selectEnvironment(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
