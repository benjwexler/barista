import React, { useState } from 'react';
import './App.css';
import Coffee from './Coffee';
import usePrevious from './hooks/usePrevious';
import { brown, drinks } from './constants';
import Select from 'react-select'

function App() {
  const [drink, setDrink] = useState({value: 'espresso', label: 'Espresso'});
  const prevDrink = usePrevious(drink);

  const colourStyles = {
    control: styles => (
      { ...styles, 
        backgroundColor: 'white',
        outline: 'none',
        boxShadow: "0px 0px yellow",
        border: '0px solid yellow',
        '&:hover': {
          outline: 'none',
          boxShadow: `0px 0px rgb(198, 244, 255)`,
        }
    }),
    menu: styles => (
      {
        ...styles,
        width: '100%',
      }
    ),
   container: styles => (
      {
        ...styles,
        outline: 'none', 
      }
    ),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = 'black';
      const offWhite = '#f3f3f3'
      const getBackgroundColor = () => {
        switch(true) {
          case isFocused:
            return offWhite;
          default:
            return data.color;
        }
      }
      return {
        ...styles,
        backgroundColor: getBackgroundColor(),
        color: isDisabled
          ? '#ccc'
          : color,
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: brown,
          color: 'white',
        },
      };
    },
    input: styles => ({ ...styles,  }),
    placeholder: styles => ({ ...styles,  }),
    singleValue: (styles, { data }) => ({ ...styles, }),
  };

  return (
    <div className="appContainer">
    <div style={{flexGrow: 1}}>
    <div id="question">What Would You Like to Drink?</div>
    <div className="selectContainer">
      <Select
        value={drink}
        options={drinks}
        onChange={(option) => setDrink(option)} 
        styles={colourStyles}
        className="select"
        />
        </div>
      <div className="coffeeContainer">
        <Coffee
          drink={drink.value}
          prevDrink={prevDrink ? prevDrink.value : null}
        />
      </div>
    </div>
    <div id="createdByContainer">
      <div id="createdBy">
      Created by:&nbsp;
        <a target="blank" href="https://www.linkedin.com/in/benjwexler/">Ben Wexler</a>
      </div>
    </div>
    </div>
  );
}

export default App;
