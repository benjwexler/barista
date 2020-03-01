import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSpring, useChain, animated } from 'react-spring'
import * as Promise from "bluebird";
import Coffee from './Coffee';
import usePrevious from './hooks/usePrevious';
import { ESPRESSO, HOT_WATER, STEAMED_MILK, FOAM, brown } from './constants';
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

function App() {
  const [drink, setDrink] = useState({value: 'espresso', label: 'Espresso'});
  const prevDrink = usePrevious(drink);
  // const drinks = ['espresso', 'americano', 'latte', 'cappuccino']
  let drinks = [
    {
      value: 'espresso',
      label: 'Espresso',
    },
    {
      value: 'americano',
      label: 'Americano',
    },
    {
      value: 'latte',
      label: 'Latte',
    },
    {
      value: 'cappuccino',
      label: 'Cappuccino',
    }
  ]

  const colourStyles = {
    control: styles => (
      { ...styles, 
        backgroundColor: 'white',
        outline: 'none',
        boxShadow: "0px 0px yellow",
        border: '0px solid yellow',
        // width: '100%',
        '&:hover': {
          outline: 'none',
          boxShadow: `0px 0px rgb(198, 244, 255)`,
          // border: '2px solid yellow',
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
      return {
        ...styles,
        // width: '100%',
        backgroundColor: isDisabled
          ? 'yellow'
          : isSelected
          ? '#f3f3f3'
          : isFocused
          ? '#f3f3f3'
          : data.color,
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
        // classNamePrefix="select"
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
