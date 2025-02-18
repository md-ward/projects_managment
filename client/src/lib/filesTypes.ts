const FileTypes: { [key: string]: string } = {
  // Document files
  ".doc": "#1B73E8",
  ".docx": "#2A64D9",
  ".pdf": "#D32F2F",
  ".xls": "#1D6F42",
  ".xlsx": "#217346",
  ".ppt": "#D24726",
  ".pptx": "#E65C2C",
  ".txt": "#555",

  // Archive files
  ".zip": "#9C27B0",
  ".rar": "#7B1FA2",
  ".tar": "#8D6E63",
  ".7z": "#AA00FF",

  // Audio files
  ".mp3": "#F57C00",
  ".wav": "#8E24AA",
  ".flac": "#4CAF50",
  ".ogg": "#E91E63",

  // 3D Model files
  ".obj": "#8D6E63",
  ".fbx": "#03A9F4",
  ".stl": "#795548",
  ".glb": "#673AB7",
  ".blend": "#FF6D00",

  // Executables & System Files
  ".exe": "#000000",
  ".bat": "#1E1E1E",
  ".sh": "#4CAF50",
  ".msi": "#1B5E20",
  ".dll": "#3F51B5",
  ".sys": "#607D8B",

  // Programming Language Files
  ".js": "#F7DF1E", // JavaScript - Yellow
  ".ts": "#3178C6", // TypeScript - Blue
  ".jsx": "#61DAFB", // React JSX - Light Blue
  ".tsx": "#007ACC", // React TSX - Light Blue
  ".py": "#3776AB", // Python - Blue
  ".java": "#B07219", // Java - Orange
  ".c": "#A8B9CC", // C - Grayish Blue
  ".cpp": "#00599C", // C++ - Blue
  ".cs": "#239120", // C# - Green
  ".php": "#777BB4", // PHP - Purple
  ".html": "#E44D26", // HTML - Orange
  ".css": "#264DE4", // CSS - Blue
  ".scss": "#C76494", // SCSS - Pink
  ".json": "#FFB74D", // JSON - Orange
  ".xml": "#F44336", // XML - Red
  ".yml": "#FFCC00", // YAML - Yellow
  ".yaml": "#FFCC00",
  ".md": "#4A90E2", // Markdown - Blue
  ".sql": "#F29111", // SQL - Orange
  ".go": "#00ADD8", // Golang - Light Blue
  ".swift": "#FA7343", // Swift - Orange
  ".kt": "#F18E33", // Kotlin - Orange
  ".rb": "#CC342D", // Ruby - Red
  ".rs": "#DEA584", // Rust - Brownish
  ".lua": "#000080", // Lua - Dark Blue
  ".dart": "#0175C2", // Dart - Light Blue
  ".pl": "#A89CDA", // Perl - Purple
  // Adobe Files
  ".psd": "#054273", // Photoshop - Dark Blue
  ".ai": "#FF9A00", // Illustrator - Orange
  ".indd": "#FF3366", // InDesign - Pink
  ".xd": "#FF26BE", // Adobe XD - Purple
  ".ae": "#9999FF", // After Effects - Light Purple
  ".pr": "#9999CC", // Premiere Pro - Dark Purple
  ".svg": "#FF9800", // Scalable Vector Graphics - Orange
  ".fla": "#FF6600", // Adobe Animate (Flash) - Orange
  ".dwg": "#009999", // AutoCAD (used in Adobe too) - Teal
  ".idml": "#FF3366", // InDesign Markup - Pink
  ".aep": "#9999FF", // After Effects Project - Light Purple
  ".pproj": "#9999CC", // Premiere Pro Project - Dark Purple
  ".anm": "#FF6600", // Animate File - Orange

  // Other Common Files
  ".csv": "#4CAF50",
  ".log": "#616161",
  ".ini": "#D4D4D4",
  ".config": "#8E8E8E",
  ".env": "#43A047",
  ".dat": "#607D8B",
  ".bak": "#795548",
};

export default FileTypes;
