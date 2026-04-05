import { BookOpen, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const notionNotes = [
  {
    id: 1,
    title: "Maven & Spring Boot in Practice",
    url: "https://attractive-jujube-8e1.notion.site/MAVEN-SPRING-BOOT-IN-PRACTICE-33811efbb5d18022b371ed0ba7df1975?pvs=73",
  },
  // Thêm note tiếp theo ở đây
];

const NotionSidebar = () => {
  const [sidebarStyle, setSidebarStyle] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let styles = {
        position: "fixed",
        zIndex: 50,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        background:
          "linear-gradient(135deg, rgba(15,12,25,0.95) 0%, rgba(20,16,35,0.95) 100%)",
        backdropFilter: "blur(16px)",
        border: "2px solid rgba(251, 146, 60,0.4)",
        borderRadius: "16px",
        padding: "0",
        boxShadow:
          "0 0 20px rgba(251, 146, 60, 0.2), 0 24px 48px rgba(0,0,0,0.4)",
        top: "100px",
      };

      // Responsive adjustments
      if (width >= 1920) {
        // Large screens
        styles.width = "340px";
        styles.right = "32px";
      } else if (width >= 1536) {
        // XL screens
        styles.width = "320px";
        styles.right = "24px";
      } else if (width >= 1280) {
        // LG screens (default)
        styles.width = "300px";
        styles.right = "16px";
      } else if (width >= 1024) {
        // MD screens
        styles.width = "280px";
        styles.right = "12px";
        styles.maxHeight = "calc(100vh - 140px)";
      }

      setSidebarStyle(styles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={sidebarStyle}
    >
      {/* Purple accent top bar */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #fb923c, #fbbf24, #fb923c)",
          backgroundSize: "200% 100%",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          padding: "20px 20px 20px 20px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 180px)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "rgba(251, 146, 60,0.25)",
                border: "1.5px solid rgba(251, 146, 60,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookOpen size={14} color="#fbbf24" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#fbbf24",
                  margin: 0,
                  lineHeight: 1.2,
                  textShadow: "0 0 10px rgba(251, 146, 60, 0.3)",
                }}
              >
                Table of Contents
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(251, 146, 60,0.5), transparent)",
            marginBottom: "16px",
          }}
        />

        {/* Notes List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {notionNotes.length > 0 ? (
            notionNotes.map((note, index) => (
              <motion.a
                key={note.id}
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + index * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "background 0.2s",
                  cursor: "pointer",
                  group: true,
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(251, 146, 60, 0.2)";
                  e.currentTarget.querySelector(".ext-icon").style.opacity =
                    "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.querySelector(".ext-icon").style.opacity =
                    "0";
                }}
              >
                {/* Number badge */}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#fbbf24",
                    background: "rgba(251, 146, 60, 0.2)",
                    border: "1px solid rgba(251, 146, 60, 0.4)",
                    borderRadius: "5px",
                    padding: "2px 6px",
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.02em",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title */}
                <span
                  style={{
                    fontSize: "12px",
                    color: "#f5f5f0",
                    flex: 1,
                    letterSpacing: "0.01em",
                    transition: "color 0.2s",
                  }}
                >
                  {note.title}
                </span>

                {/* External link icon */}
                <span
                  className="ext-icon"
                  style={{
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <ExternalLink size={11} color="#fbbf24" />
                </span>
              </motion.a>
            ))
          ) : (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(120,113,108,0.6)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Coming soon...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "rgba(87,83,78,0.7)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            © 2025
          </p>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#7c3aed",
              boxShadow: "0 0 8px #7c3aed",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NotionSidebar;
