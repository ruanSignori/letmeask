import { Toaster, toast } from 'react-hot-toast';

import { MdContentCopy } from 'react-icons/md';

import '../../styles/roomCode.scss';

type RoomCodeProps = {
  code: string
}
export function RoomCode(props: RoomCodeProps): JSX.Element {
  const copyRoomCodeToClipboard = (): void => {
    navigator.clipboard.writeText(props.code);
    toast.success('Copiado para a área de transferência!');
  }

  return (
    <>
      <button className="room-code" onClick={() => copyRoomCodeToClipboard()}>
        <div className='copy-icon'>
          <MdContentCopy color='#fff'/>
        </div>
        <div className='code'>Sala #{props.code}</div>
      </button>

      <Toaster />
    </>
  );
}