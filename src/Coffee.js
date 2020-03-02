import React, { useState, useEffect } from 'react';
import './App.css';
import { useSpring, animated, useTransition } from 'react-spring'
import * as Promise from "bluebird";
import { ESPRESSO, HOT_WATER, STEAMED_MILK, FOAM, brown, getIngredientsForDrink } from './constants';

function Coffee({ drink, prevDrink }) {
  const [shouldShowEspresso, setShouldShowEspresso] = useState(false);
  const [shouldShowWater, setShouldShowWater] = useState(false);
  const [showMilk, shouldShowMilk] = useState(false);
  const [milkAmount, setMilkAmount] = useState(75)
  const [foamAmount, setFoamAmount] = useState(25)
  const [showFoam, setShowFoam] = useState(false)
  const [espressoAdded, setEspressoAdded] = useState(false)
  const [waterAdded, setWateradded] = useState(false)
  const [foamAdded, setFoamAdded] = useState(false);
  const [shouldShowDrinkText, setShouldShowDrinkText] = useState(false)
  const ingredientsInDrink = getIngredientsForDrink(drink);

  const makeEspresso = async () => {
    const _tasks = [
      {
        function: () => setShouldShowEspresso(true),
        delay: 0,
      },
    ]
    await timeOutChain(_tasks)
    return Promise.resolve(null)
  }

  const makeAmericano = async () => {
    const _tasks = [
      {
        ingredient: ESPRESSO,
        function: () => setShouldShowEspresso(true),
        delay: 0,
      },
      {
        ingredient: HOT_WATER,
        function: () => setShouldShowWater(true),
        delay: espressoAdded ? 0 : 450,
      },
    ]
    await timeOutChain(_tasks)

    return Promise.resolve(null)
  }

  const removeAmericano = async () => {
    const _tasks = [
      {
        ingredient: HOT_WATER,
        function: async () => await setShouldShowWater(false),
        delay: 0,
      },
      {
        ingredient: ESPRESSO,
        function: async () => await setShouldShowEspresso(true),
        delay: espressoAdded ? 0 : 450,
      },
      {
        function: async () => await Promise.resolve(null),
        delay: 700,
      },
    ]
    await timeOutChain(_tasks)

    return Promise.resolve(null)
  }

  const makeLatte = async () => {
    const _tasks = [
      {
        ingredient: ESPRESSO,
        function: () => makeEspresso(),
        delay: !waterAdded ? 0 : 450,
      },
      {
        ingredient: FOAM,
        function: () => setFoamAmount(25),
        delay: 0,
      },
      {
        ingredient: STEAMED_MILK,
        function: () => setMilkAmount(75),
        delay: 0,
      },
      {
        ingredient: STEAMED_MILK,
        function: () => shouldShowMilk(true),
        delay: espressoAdded ? 0 : 700,
      },
      {
        ingredient: FOAM,
        function: () => setShowFoam(true),
        delay: 700,
      },

    ]
    await timeOutChain(_tasks)
    return Promise.resolve(null)
  }

  const makeCappuccino = async () => {
    const _tasks = [
      {
        ingredient: ESPRESSO,
        function: () => makeEspresso(),
        delay: !waterAdded ? 0 : 450,
      },
      {
        ingredient: STEAMED_MILK,
        function: () => setMilkAmount(55),
        delay: 0,
      },

      {
        ingredient: STEAMED_MILK,
        function: () => shouldShowMilk(true),
        delay: espressoAdded ? 0 : 700,
      },
      {
        ingredient: STEAMED_MILK,
        function: () => setFoamAmount(45),
        delay: 0,
      },
      {
        ingredient: FOAM,
        function: () => setShowFoam(true),
        delay: 700,
      },
    ]
    await timeOutChain(_tasks)
    return Promise.resolve(null)
  }

  const removeLatte = async () => {
    const _tasks = [
      {
        function: async () => {
          if (!ingredientsInDrink.some((ingredient) => ingredient === 'foam')) {
            return await setShowFoam(false)
          }
          return await Promise.resolve(null)

        },
        delay: 0,
      },
      {
        function: async () => {
          if (!ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk')) {
            return await shouldShowMilk(false);
          }
          return await Promise.resolve(null)

        },
        delay: !ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk') ? 700 : 0,
      },
      {
        function: async () => await Promise.resolve(null),
        delay: !ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk' || ingredient === 'foam') ? 400 : 0,
      },
    ]
    await timeOutChain(_tasks)
    return Promise.resolve(null)

  }

  const removeCappuccino = async () => {
    const _tasks = [
      {
        function: async () => {
          if (!ingredientsInDrink.some((ingredient) => ingredient === 'foam')) {
            return await setShowFoam(false)
          }
          return await Promise.resolve(null)

        },
        delay: 0,
      },
      {
        function: async () => {
          if (!ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk')) {
            return await shouldShowMilk(false);
          }
          return await Promise.resolve(null)

        },
        delay: !ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk') ? 700 : 0,
      },
      {
        function: async () => await Promise.resolve(null),
        delay: !ingredientsInDrink.some((ingredient) => ingredient === 'steamedMilk' || ingredient === 'foam') ? 400 : 0,
      },
    ]
    await timeOutChain(_tasks)
    return Promise.resolve(null)
  }


  const timeOutChain = async (tasks) => {
    return tasks.reduce((promiseChain, currentTask) => {
      return promiseChain.delay(currentTask.delay).then(async (chainResults) => {
        await currentTask.function()
        return currentTask.delay
        // currentTask().then(currentResult =>
        //     [ ...chainResults, currentResult ]
        // )
      }
      );
    }, Promise.resolve([])).then(arrayOfResults => {
      return console.log('arrayOfResults', arrayOfResults)
      // Do something with all results
    });

  }

  const update = async (drink, prevDrink) => {

    const getPrevDrinkAction = async (prevDrink) => {
      switch (prevDrink) {
        case 'americano':
          return removeAmericano();
        case 'latte':
          return removeLatte();
        case 'cappuccino':
          return removeCappuccino();
        case 'espresso':
        default:
          return Promise.resolve(null)
      }
    }

    const getCurrentDrinkAction = (drink) => {
      switch (drink) {
        case 'espresso':
          return makeEspresso();
        case 'americano':
          return makeAmericano();
        case 'latte':
          return makeLatte();
        case 'cappuccino':
          return makeCappuccino();

        default:
          return Promise.resolve(null)
      }
    }

    const _tasks = [
      {
        function: async () => await setShouldShowDrinkText(false),
        delay: 0,
      },
      {
        function: async () => await getPrevDrinkAction(prevDrink),
        delay: 0,
      },
      {
        function: async () => await getCurrentDrinkAction(drink),
        delay: 0,
      },
      {
        function: async () => await setShouldShowDrinkText(true),
        delay: 200,
      },
    ]
    await timeOutChain(_tasks);
  }

  useEffect(() => {
    update(drink, prevDrink);
  }, [drink])

  const espressoProps = useSpring({
    transform: shouldShowEspresso ? 'scaleY(1)' : 'scaleY(0)',
    background: brown,
    color: 'white',
    height: '100%',
    bottom: 0,
    config: {
      duration: 450,
    },
    onRest: () => {
      if (shouldShowEspresso) {
        setEspressoAdded(true)
      } else {
        setEspressoAdded(false)
      }
    },
  })

  const waterProps = useSpring({
    transform: shouldShowWater ? 'scaleY(1)' : 'scaleY(0)',
    height: '100%',
    bottom: 0,
    background: 'rgb(198, 244, 255)',
    color: 'rgb(53, 123, 127)',
    config: {
      duration: 700,
    },
    onRest: () => {},
  })

  const foamProps = useSpring({
    transform: showFoam ? 'scaleY(1)' : 'scaleY(0)',
    height: `${foamAmount}%`,
    top: 0,
    transformOrigin: 'bottom',
    background: 'white',
    color: brown,
    config: {
      duration: 400,
    },
    onRest: () => {
      if (showFoam) {
        setFoamAdded(true)
      } else {
        setFoamAdded(false)
      }
    },
  })

  const milkProps = useSpring({
    transform: showMilk ? 'scaleY(1)' : 'scaleY(0)',
    height: `${milkAmount}%`,
    bottom: 0,
    background: 'rgb(246, 250, 220)',
    color: brown,
    config: {
      duration: 700,
    },
    onRest: () => {},
  })

  const [drinkText, setDrinktext] = useState('')
  const transitions = useTransition(drinkText, null, {
    from: { position: 'absolute', opacity: 0, color: brown, transform: 'scaleY(0)', },
    enter: { opacity: 1, color: 'white', transform: 'scaleY(1)', },
    leave: { position: 'absolute', opacity: 0 },
    color: 'white',
    width: '100%',
    transformOrigin: 'bottom',
    config: {
      duration: 700,
    },
  })

  useEffect(() => {
    if (shouldShowDrinkText) {
      setDrinktext(drink)
    } else {
      setDrinktext('')
    }
  }, [shouldShowDrinkText])

  return (
    <>
      <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center' }}>
        <div className="cupBodyContainer">
          <div className="drinkTextContainer">
            {transitions.map(({ item, key, props }) => {
              return (
                <animated.div className="drinkText" key={item} style={props}>{item}</animated.div>
              )
            }
            )}
          </div>
          <div className="rectangle">
            <animated.div
              className="overlay"
              style={waterProps}
            >
              <div style={{ textAlign: 'center', margin: 'auto' }}>Hot Water</div>
            </animated.div>

            <animated.div
              className="overlay"
              style={foamProps}
            >
              <div style={{ textAlign: 'center', margin: 'auto' }}>Foam</div>
            </animated.div>

            <animated.div
              className="overlay"
              style={milkProps}
            >
              <div style={{ textAlign: 'center', margin: 'auto' }}>Steamed Milk</div>
            </animated.div>
          </div>

          <div className="cupBottom">
            <animated.div
              className="overlay"
              style={espressoProps}
            >
              <div style={{ textAlign: 'center', margin: 'auto' }}>Espresso</div>
            </animated.div>
          </div>
        </div>
        <div className="handleContainer">
          <div className="innerHandle"></div>
        </div>
      </div>
    </>
  );
}

export default Coffee;
