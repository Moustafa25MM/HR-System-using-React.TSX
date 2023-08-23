import { Link } from 'react-router-dom';

import './NotFound.css';
function NotFound() {
  return (
    <div className='back'>
      <main className='main'>
        <section className='main'>
          <div className='home__container'>
            <div className='home__data'>
              <span className='home__subtitle'>Error 404</span>
              <h1 className='home__title'>Hey Buddy</h1>
              <p className='home__description'>
                We can't seem to find the page <br />
                you are looking for.
              </p>
              <Link to='/login' className='home__button'>
                {' '}
                Go To Login{' '}
              </Link>
            </div>

            <div className='home__img'>
              <img
                src={process.env.PUBLIC_URL + 'assets/ghost-img.png'}
                alt=''
              />
              <div className='home__shadow'></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;
