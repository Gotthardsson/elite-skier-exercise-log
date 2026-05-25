// DraggableTemplateItem.tsx
import type { TemplateType } from "../../../types/TemplateType";

interface DraggableTemplateItemProps {
  template: TemplateType;
}

export function DraggableTemplateItem({ template }: DraggableTemplateItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    // Gör om hela mall-objektet till en textsträng så kalendern kan läsa det vid "drop"
    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="dropdown-template-item"
      style={{
        padding: "8px 12px",
        margin: "4px 0 4px 15px", // Skjut in den lite så det syns att den tillhör mappen
        backgroundColor: "#f5f5f5",
        borderLeft: "3px solid #007bff",
        borderRadius: "4px",
        cursor: "grab",
        fontSize: "14px"
      }}
    >
      📄 {template.title}
    </div>
  );
}