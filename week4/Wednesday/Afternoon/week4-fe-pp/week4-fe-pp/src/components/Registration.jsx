// components/Registration.jsx
import { useState } from 'react';
import Title from "./Title";


const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const onSubmit = e => {
    e.preventDefault();

    setName('');
    setEmail('');
    setPassword('');
  };
  return (
    <section className="section" id="registration">
      <div className="section-title">
        <Title title="user registration" />
      </div>

      <div className="section-center">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor='name'>Name:</label>
            <input
              id='name'
              type='text'
              onChange={e => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='email'
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor='password'>Password:</label>
            <input
              id='password'
              type='password'
              onChange={e => setPassword(e.target.value)}
              value={password}
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Registration;