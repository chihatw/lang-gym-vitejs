import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';

const ToggleSelectorIcon = ({
  disabled,
  handleToggle,
}: {
  disabled?: boolean;
  handleToggle: () => void;
}) => {
  return (
    <div
      style={{
        position: 'relative',
        left: 16,
      }}
    >
      <IconButton size='small' disabled={disabled} onClick={handleToggle}>
        <LabelOutlinedIcon
          style={{
            color: disabled ? '#ccc' : '#86bec4',
            position: 'relative',
            transform: 'rotate(270deg)',
          }}
        />
      </IconButton>
      <div
        style={{
          top: -15,
          left: 16,
          height: 21,
          position: 'absolute',
          borderLeft: `2px dotted ${disabled ? '#ccc' : '#86bec4'}`,
        }}
      />
    </div>
  );
};

export default ToggleSelectorIcon;
