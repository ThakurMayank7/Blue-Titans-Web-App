const Spinner = ({ size = 60, stroke = "#78350F" }) => {
  return (
    <svg
      width={size}
      height={size}
      stroke={stroke}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <style>
        {`
            .spinner circle {
              stroke-linecap: round;
              animation: spinner-animation 1.5s ease-in-out infinite;
            }
            @keyframes spinner-animation {
              0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
              47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
              95%, 100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
            }
          `}
      </style>
      <g className="spinner">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" />
      </g>
    </svg>
  );
};

export default Spinner;
