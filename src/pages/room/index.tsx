import { FormEvent, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AiFillLike, AiOutlineSend } from 'react-icons/ai';

import { database, push, ref, remove } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { Button } from '../../components/button';
import { Question } from '../../components/question';
import { RoomCode } from '../../components/roomCode';

import logoImg from '../../assets/images/logo.svg';

import '../../styles/room.scss';

type RoomParams = {
  id: string
}

export function Room(): JSX.Element {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');

  const roomId = params.id as string;

  const { title, questions } = useRoom(roomId);

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return toast.error('Campo de texto vazio');
    };

    if (!user) {
      return toast.error('Você precisa estar logado');
    };

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await push(ref(database, `/rooms/${roomId}/questions`), question);

    toast.success('Pergunta enviada com sucesso');
    setNewQuestion('');
  };

  const handleLikeQuestion = async (questionId: string, likeId: string | undefined) => {
  
    if (likeId) { 
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`));
    } else {
      await push(ref(database, `rooms/${roomId}/questions/${questionId}/likes`), {
        authorId: user?.id
      });
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to='/'><img src={logoImg} alt="Logo LetMeask" /></Link>
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1>Sala {title}</h1>
         { questions.length > 0 && <span>{questions.length} pergunta(s)</span> } 
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder='O que você quer perguntar'
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user && (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <div>{user.name}</div>
              </div>
            )}

            {!user && (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type='submit' disabled={!user}>
              <div>Enviar pergunta</div>
              <AiOutlineSend className='icon-send'/>
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && 
                  <button
                    className={`like-button ${question.likeId ? 'liked': ''}`}
                    type='button'
                    aria-label='Marcar como gostei'
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    {question.likeCount > 0 && 
                      <div>{question.likeCount}</div>
                    }
                    <AiFillLike className='icon-like' />
                  </button>
                }
            </Question>
          ))}
        </div>
      </main>
      <Toaster />
    </div>
  );
}