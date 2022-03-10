import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, get, child } from '../../services/firebase';
import { Toaster, toast } from 'react-hot-toast';

import { Button } from '../../components/button';
import { FaGoogle } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';

import answers from '../../assets/images/answers.svg';
import logoImg from '../../assets/images/logo.svg';
import '../../styles/auth.scss';

export function Home(): JSX.Element {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    if (!user) await signInWithGoogle();
   
    navigate('/rooms/new');
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return toast.error('Código de sala vazio');
    };

    await get(child(ref(database), `/rooms/${roomCode}`))
      .then(snapshot => {
        if (snapshot.val().endedAt) {
          return toast.error('Esta sala foi encerrada');
        }
        snapshot.exists() ? navigate(`/rooms/${roomCode}`) : toast.error('Sala inexistente');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='page-auth'>
      <aside>
        <img src={answers} alt="Ilustração simbolizando pergunta e respostas rocketseat" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua comunidade em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="letmeask" />
          <button className='create-room' onClick={() => handleCreateRoom()}>
            <FaGoogle width='30' aria-label='Criar sala com o Google' />
            Crie sua sala com o Google
          </button>
          <div className='separator'>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <div>
              <input
                id='room'
                type="text"
                onChange={e => setRoomCode(e.target.value)}
                value={roomCode}
              />
              <label htmlFor="room">Digite o código da sala</label>
            </div>
            <Button type='submit'>
              Entra na sala
            </Button>
          </form>
        </div>
      </main>

      <Toaster />
      
    </div>
  );
}
