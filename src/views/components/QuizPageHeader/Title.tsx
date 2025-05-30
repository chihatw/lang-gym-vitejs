import { useTheme } from '@mui/material';

const Title = ({ title }: { title: string }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 24,
      }}
    >
      {title}
    </div>
  );
};

export default Title;
