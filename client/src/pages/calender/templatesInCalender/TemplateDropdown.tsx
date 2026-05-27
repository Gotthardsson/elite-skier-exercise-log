// TemplateDropdown.tsx
import { useState, useRef, useEffect } from "react";
import type { FolderType } from "../../../types/FolderType";
import type { TemplateType } from "../../../types/TemplateType";
// Importera din nya knappkomponent
import ButtonPrimary from "../../../components/ButtonPrimary";

interface TemplateDropdownProps {
  folders: FolderType[];
  templates: TemplateType[];
}

export default function TemplateDropdown({ folders, templates }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openFolderIds, setOpenFolderIds] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Stäng menyn vid klick utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFolder = (folderId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Viktigt! Hindrar dropdownen från att stängas vid klick på en mapp
    setOpenFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  };

  const handleDragStart = (e: React.DragEvent, template: TemplateType) => {
    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "move";
  };

  // Sortera ut de mallar som inte har en mapp (Lösa mallar)
  const looseTemplates = templates.filter(t => !t.folderId && t.folderId !== 0);

  return (
    <div ref={dropdownRef} className="template-dropdown-wrapper" style={{ position: "relative", marginLeft: "auto" }}>
      
      {/* NYTT: Använd ButtonPrimary istället för den gamla HTML-knappen */}
      <ButtonPrimary 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", alignItems: "center", gap: "6px" }}
      >
        Mallar ▾
      </ButtonPrimary>

      {isOpen && (
        <div className="template-dropdown-menu" style={{
          position: "absolute",
          top: "110%",
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          minWidth: "260px",
          maxHeight: "350px",
          overflowY: "auto",
          zIndex: 999,
          padding: "8px"
        }}>
          <div style={{ padding: "4px 8px", fontWeight: "bold", borderBottom: "1px solid #eee", marginBottom: "6px", fontSize: "13px", color: "#666" }}>
            Dra en mall till kalendern:
          </div>

          {/* LOOPA ALLA MAPPAR (Dropdown nivå 1) */}
          {folders?.map((folder) => {
            const isExpanded = openFolderIds.includes(folder.id);
            const folderTemplates = templates.filter(t => (t.folderId ?? t.folderId) === folder.id);

            return (
              <div key={folder.id} style={{ marginBottom: "2px" }}>
                <div 
                  onClick={(e) => toggleFolder(folder.id, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 8px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    // NYTT: Soft färg-mix här också baserat på mappen egna färg istället för tråkigt grå!
                    backgroundColor: isExpanded 
                      ? `color-mix(in srgb, ${folder.color || "#3b82f6"} 15%, transparent)` 
                      : "transparent",
                    color: isExpanded ? (folder.color || "#000") : "inherit",
                    fontWeight: isExpanded ? "bold" : "normal"
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#888", marginRight: "2px" }}>{isExpanded ? "▼" : "▶"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={folder.color || "#444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                  </svg>
                  <span style={{ fontSize: "14px" }}>{folder.name}</span>
                </div>

                {/* VISAL MALLAR INUTI MAPPEN (Dropdown nivå 2) */}
                {isExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", paddingLeft: "24px" }}>
                    {folderTemplates.length === 0 ? (
                      <span style={{ fontSize: "12px", color: "#aaa", padding: "4px 0" }}>Tom mapp</span>
                    ) : (
                      folderTemplates.map((template) => (
                        <div
                          key={template.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, template)}
                          style={{
                            padding: "6px 8px",
                            margin: "2px 0",
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #eef",
                            // Snygg detalj: Mallens vänsterkant matchar mappens färg
                            borderLeft: `3px solid ${folder.color || "#3b82f6"}`,
                            borderRadius: "4px",
                            cursor: "grab",
                            fontSize: "13px",
                            color: "#333" // Tvinga mörk text i dropdownen
                          }}
                        >
                           {template.title}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* LÖSA MALLAR (UTAN MAPP) */}
          {looseTemplates.length > 0 && (
            <>
              <div style={{ padding: "6px 8px 2px 8px", fontWeight: "bold", fontSize: "11px", color: "#999", textTransform: "uppercase", marginTop: "6px" }}>
                Lösa mallar
              </div>
              {looseTemplates.map((template) => (
                <div
                  key={template.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, template)}
                  style={{
                    padding: "6px 8px",
                    margin: "2px 8px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    borderLeft: "3px solid #999",
                    borderRadius: "4px",
                    cursor: "grab",
                    fontSize: "13px",
                    color: "#333"
                  }}
                >
                   {template.title}
                </div>
              ))}
            </>
          )}

          {folders?.length === 0 && templates?.length === 0 && (
            <div style={{ padding: "12px", textAlign: "center", color: "#999", fontSize: "13px" }}>Inga mallar skapade än</div>
          )}
        </div>
      )}
    </div>
  );
}