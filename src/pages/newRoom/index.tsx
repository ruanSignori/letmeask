import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

import { Button } from '../../components/button';

import { database, ref, push, child, update } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

import answers from '../../assets/images/answers.svg';
import logoImg from '../../assets/images/logo.svg';

import '../../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const navigate = useNavigate(); //useHistory has been replaced by useNavigate in react-router-dom v6
  const [newRoom, setNewRoom] = useState('');

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return toast.error('Nome da sala vazio');
    }

    try {
      const newRoomKey = push(child(ref(database), 'rooms')).key;

      await update(child(ref(database), `rooms/${newRoomKey}`), {
        title: newRoom,
        authorId: user?.id
      });
  
      navigate(`/admin/rooms/${newRoomKey}`);
    } catch(error) {
      console.error(error);
      return toast.error('Não foi possível criar a sala');
    } 
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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <div>
              <input
                id='room'
                type="text"
                value={newRoom}
                onChange={event => setNewRoom(event?.target.value)}
              />
              <label htmlFor="room">Nome da sala</label>
            </div>
            <Button type='submit'>
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link>
          </p>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
