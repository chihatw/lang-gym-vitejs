import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectArticle } from 'application/articlePage/framework/2-selector';

const Title = () => {
  const theme = useTheme();
  const article = useSelector((state: RootState) => selectArticle(state));

  if (!article) return <></>;
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 24,
      }}
    >
      {article.title}
    </div>
  );
};

export default Title;
