import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { BiCheckCircle, BiComment, BiTrashAlt } from 'react-icons/bi';

import { child, database, ref, remove, update, get } from '../../services/firebase';

import { useRoom } from '../../hooks/useRoom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/button';
import { Question } from '../../components/question';
import { RoomCode } from '../../components/roomCode';

import logoImg from '../../assets/images/logo.svg';
import '../../styles/room.scss';


type RoomParams = {
  id: string
}

export function AdminRoom(): JSX.Element {
  const { user } = useAuth(); 
  const params = useParams<RoomParams>();
  const roomId = params.id as string;
  const { title, questions } = useRoom(roomId);
  const [accessAdminRoom, setAccessAdminRoom] = useState(false);
  const navigate = useNavigate();
  
  const handleAccessAdminRoom = useCallback(async (userId: string, roomId: string): Promise<void> => {
    await get(child(ref(database), `rooms/${roomId}`))
      .then(snapshot => {
        const refAuthorId = snapshot.val();
        if (userId === refAuthorId.authorId) {
          setAccessAdminRoom(true);
        } else {
          navigate('/404');
        }
      })
      .catch(error => {
        console.error(error);
        navigate('/home');
      });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && roomId) {
      handleAccessAdminRoom(user?.id, roomId);
    }
  }, [user, roomId, handleAccessAdminRoom]);


  const handleEndRoom = async () => {
    const date = new Date();

    await update(child(ref(database), `rooms/${roomId}`), {
      endedAt: date.toLocaleString('pt-br')
    });

    navigate('/');
  };

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    await update(child(ref(database), `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true,
    });
  };

  const handleHighlightQuestion = async (questionId: string) => {
    await update(child(ref(database), `rooms/${roomId}/questions/${questionId}`), {
      isHighlighted: true,
    });
  }
  
  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`));
      toast.success('Pergunta removida');
    };
  };

  return (
    <>
      {accessAdminRoom && (
        <div id="page-room">
          <header>
            <div className="content">
              <Link to='/'>
                <img src={logoImg} alt="Logo LetMeask" />
              </Link>
              <div>
                <RoomCode code={roomId} />
                <Button isOutlined onClick={() => handleEndRoom()}>Encerrar sala</Button>
              </div>
            </div>
          </header>

          <main className='content'>
            <div className="room-title">
              <h1>Sala {title}</h1>
            { questions.length > 0 && <span>{questions.length} pergunta(s)</span> } 
            </div>

            <div className="question-list">
              {questions.map(question => (
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type='button'
                          onClick={() => handleCheckQuestionAsAnswered(question.id)}
                        >
                          <BiCheckCircle
                            aria-label='Marcar pergunta como respondida'
                            className='icon' 
                          />
                        </button>
                        <button
                          type='button'
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <BiComment aria-label='Adicionar destaque a pergunta' className='icon'/>
                        </button>
                      </>
                    )}

                    <button
                      type='button'
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <BiTrashAlt
                        aria-label='Remover pergunta'
                        className='icon'
                      />
                    </button>
                </Question>
              ))}
            </div>
            <Toaster />
          </main>
        </div>
      )}
    </>
  );
}
