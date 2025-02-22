import { Priority } from "@/state/api";
type ContainerShape = "rounded" | "square";
const PriorityTag = ({
  priority,
  ContainerShape,
}: {
  priority: Priority;
  ContainerShape?: ContainerShape;
}) => {
  let bgColor, textColor;

  switch (priority) {
    case "Urgent":
      bgColor = "bg-red-200";
      textColor = "text-red-700";
      break;
    case "High":
      bgColor = "bg-yellow-200";
      textColor = "text-yellow-700";
      break;
    case "Medium":
      bgColor = "bg-green-200";
      textColor = "text-green-700";
      break;
    case "Low":
      bgColor = "bg-blue-200";
      textColor = "text-blue-700";
      break;
    default:
      bgColor = "bg-gray-200";
      textColor = "text-gray-700";
  }

  return (
    <div
      title={"Priority: " + priority}
      className={`flex  place-content-center items-center  aspect-square  ${ContainerShape === "square" ? "rounded-sm" : "rounded-full"} text-center w-full  text-xs font-semibold ${bgColor} ${textColor}`}
    >
      {priority}
    </div>
  );
};

export default PriorityTag;
