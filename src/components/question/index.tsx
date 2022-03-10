import { ReactNode } from 'react';
import cx from 'classnames';

import '../../styles/question.scss'

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children
}: QuestionProps): JSX.Element {
  return (
    <div 
      className={cx(
        'question', 
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <div>{author.name}</div>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}