const PhoneIcon = ({ stroke = '#64748B', width = 23, height = 23 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.35 11.35 0 003.56.6 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.61a1 1 0 011 1 11.35 11.35 0 00.6 3.56 1 1 0 01-.21 1.11l-2.2 2.2z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PhoneIcon;
