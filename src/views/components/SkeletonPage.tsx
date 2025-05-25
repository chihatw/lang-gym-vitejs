import { Container } from '@mui/material';
import ArticleSkeleton from './ArticleSkeleton';

const SkeletonPage = () => {
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16 }}>
        <ArticleSkeleton />
      </div>
    </Container>
  );
};

export default SkeletonPage;
