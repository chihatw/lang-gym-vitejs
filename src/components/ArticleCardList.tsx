import { Button, Card, CardContent, useTheme } from '@mui/material';
import React from 'react';
import CustomLabel from './CustomLabel';

const ArticleCardList = ({
  label,
  cards,
  showListButtonLabel,
  handleClick,
  handleShowList,
}: {
  label: string;
  cards: {
    id: string;
    date: string;
    title: string;
  }[];
  handleClick: (value: string) => void;
  handleShowList?: () => void;
  showListButtonLabel: string;
}) => {
  const theme = useTheme();
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <CustomLabel label={label} />
      {cards.map((card, index) => (
        <CardContainer key={index} card={card} handleClick={handleClick} />
      ))}
      {!!handleShowList && (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => handleShowList()}
            sx={{
              ...(theme.typography as any).mPlusRounded300,
              color: '#52a2aa',
              fontSize: 12,
            }}
          >
            {showListButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArticleCardList;

const CardContainer = ({
  card,
  handleClick,
}: {
  card: {
    id: string;
    date: string;
    title: string;
  };
  handleClick: (value: string) => void;
}) => {
  const theme = useTheme();
  const { id, date, title } = card;
  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={() => handleClick(id)}
      elevation={0}
    >
      <CardContent>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded300,
            userSelect: 'none',
          }}
        >
          <div style={{ color: '#777', fontSize: 10 }}>{date}</div>
          <div style={{ fontSize: 14 }}>{title}</div>
        </div>
      </CardContent>
    </Card>
  );
};
