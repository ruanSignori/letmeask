import server from '../../assets/images/server.svg';

import '../../styles/error404.scss';

export function Error404(): JSX.Element {
  return (
    <div className='overview-404' >
      <div>
        <h1 className='title-error'>Erro 404, página não encontrada</h1>
        <img src={server} alt="Imagem de manutenção em servidor" />
      </div>
    </div>
  )
} 