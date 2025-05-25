import { Skeleton } from '@mui/material';

const ArticleSkeleton = () => {
  return (
    <div style={{ marginTop: 16, marginBottom: 80 }}>
      <Skeleton height={54} width={280} />
      <Skeleton height={24} width={120} />
      <Skeleton height={240} />
    </div>
  );
};

export default ArticleSkeleton;
