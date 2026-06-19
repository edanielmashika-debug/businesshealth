type DashboardCardProps = {
  title: string;
  amount: string;
  icon?: React.ReactNode;
};

export default function DashboardCard({ title, amount, icon }: DashboardCardProps) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid #ffffff0d",
        background: "#0f1117",
        padding: "20px 22px",
        color: "#f0f0ff",
        transition: "all 0.2s ease",
        cursor: "default",
        backgroundImage:
          "radial-gradient(ellipse at top right, #7c3aed0a 0%, transparent 60%)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed33";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px #7c3aed14";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top glow dot */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#7c3aed",
          opacity: 0.12,
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {title}
          </p>
          <h2
            style={{
              marginTop: 8,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f0f0ff",
            }}
          >
            {amount}
          </h2>
        </div>

        {icon && (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "#7c3aed1a",
              border: "1px solid #7c3aed33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c4b5fd",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 20,
          height: 2,
          width: "100%",
          background: "#ffffff08",
          borderRadius: 99,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            width: "60%",
            background: "linear-gradient(90deg, #7c3aed, #06ffa5)",
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}
