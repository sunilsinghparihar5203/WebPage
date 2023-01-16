import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Inputs/Input';

const EmailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  }
  if (action.type === 'USER_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }

  return { value: '', isValid: false }
};

const PassReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  }
  if (action.type === 'USER_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }
  return { value: '', isValid: false }
}

const Login = (props) => {
  const ctx = useContext(AuthContext)
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(EmailReducer, {
    value: '', isValid: false
  })
  const [passState, dispatchPass] = useReducer(PassReducer, {
    value: '', isValid: false
  })

  const { isValid: emailIsValid } = emailState
  const { isValid: passIsValid } = passState
  useEffect(() => {
    const cleanUp = setTimeout(() => {
      console.log("Checking validity")
      setFormIsValid(emailIsValid && passIsValid);
    }, 500);

    return () => {
      console.log("clean UP")
      clearTimeout(cleanUp)
    }

  }, [emailIsValid, passIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value })
  };

  const passwordChangeHandler = (event) => {
    dispatchPass({ type: "USER_INPUT", val: event.target.value })
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "USER_BLUR" })
  };

  const validatePasswordHandler = () => {
    dispatchPass({ type: "USER_BLUR" })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
          <Input type="email" id="email" value={emailState.value} onChange={emailChangeHandler} onBlur={validateEmailHandler} label="Email" isValid={emailIsValid}/>
          <Input type="password" id="password" value={passState.value} onChange={passwordChangeHandler} onBlur={validatePasswordHandler} label="Password" isValid={passIsValid}/>

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>

      </form>
    </Card>
  );
};

export default Login;
