import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSpring, useChain, animated, useTransition } from 'react-spring'
import * as Promise from "bluebird";
import { ESPRESSO, HOT_WATER, STEAMED_MILK, FOAM, brown } from './constants';


const getIngredientsForDrink = (drink) => {
  switch (drink) {
    case 'espresso':
      return ['espresso'];
    case 'americano':
      return ['espresso', 'hotWater'];
    case 'latte':
    case 'cappuccino':
      return ['espresso', 'steamedMilk', 'foam'];
    default:
      return [];
  }
}


function Coffee({ drink, prevDrink }) {
  const espressoRef = useRef();
  const waterRef = useRef();
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

  const [ingredients, setIngredients] = useState([]);
  const ingredientsInDrink = getIngredientsForDrink(drink);
  console.log('ingredientsInDrink', ingredientsInDrink)

  useEffect(() => {

  }, [drink])

  // const addRemoveIngredient = (_shouldShowEspresso, ourIngredient) => {
  //   const _ingredients = ingredients.slice()
  //   if (_shouldShowEspresso) {
  //     const index = _ingredients.findIndex(ingredient => ingredient === ourIngredient);
  //     if (index === -1) {
  //       setIngredients([..._ingredients, ourIngredient])
  //     }
  //   } else {
  //     const index = _ingredients.findIndex(ingredient => ingredient === ourIngredient);
  //     if (index !== -1) {
  //       _ingredients.splice(index, 1)
  //       setIngredients(_ingredients)
  //     }
  //   }
  // }



  // useEffect(() => {
  //   addRemoveIngredient(shouldShowEspresso, 'espresso')

  // }, [shouldShowEspresso])

  // useEffect(() => {
  //   addRemoveIngredient(shouldShowWater, 'hotWater')

  // }, [shouldShowWater])


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
    console.log('ingredientsInDrink', ingredientsInDrink)
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
        // console.log('currentTask', currentTask.function())
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
          break;
        case 'latte':
          return removeLatte();
        case 'cappuccino':
          return removeCappuccino();
        case 'espresso':
        default:
          return Promise.resolve(null)


          break;
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
    await timeOutChain(_tasks)



  }


  useEffect(() => {
    console.log('drink', drink)
    console.log('prevDrink', prevDrink)

    update(drink, prevDrink)

  }, [drink])

  useEffect(() => {
    const _tasks = [
      {
        function: () => makeEspresso(),
        delay: 0,
      },
      {
        function: () => makeAmericano(),
        delay: 1500,
      },
      {
        function: () => makeEspresso(),
        delay: 1500,
      },
      {
        function: () => makeLatte(),
        delay: 1500,
      },

    ]
    // timeOutChain(_tasks)


  }, [])

 





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
    // transform: 'scaleY(1)',
    background: 'rgb(198, 244, 255)',
    color: 'rgb(53, 123, 127)',
    config: {
      duration: 700,
    },
    onRest: () => {
    },
  })

  const foamProps = useSpring({
    transform: showFoam ? 'scaleY(1)' : 'scaleY(0)',
    height: `${foamAmount}%`,
    top: 0,
    transformOrigin: 'bottom',
    // transform: 'scaleY(1)',
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
    // transformOrigin: 'bottom';
    // transform: 'scaleY(1)',
    background: 'rgb(246, 250, 220)',
    color: brown,
    config: {
      duration: 700,
    },
    onRest: () => {
    },
  })

  // useChain([espressoRef, waterRef], [0, 1])

  const [toggle, set] = useState("blah")

  const [drinkText, setDrinktext] = useState('')
  const transitions = useTransition(drinkText, null, {
    from: { position: 'absolute', opacity: 0, color: brown, transform: 'scaleY(0)', },
    enter: { opacity: 1, color: 'white', transform: 'scaleY(1)', },
    leave: { position: 'absolute', opacity: 0 },
    color: 'white',
    width: '100%',
    // transition: 'all .5s';
    transformOrigin: 'bottom',
    config: {
      duration: 700,
    },
  })

  useEffect(() => {
    if(shouldShowDrinkText) {
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
        console.log('item', item)
        console.log('props', props)
         return (
           <animated.div class="drinkText" onClick={() => set("YO")} style={props}>{item}</animated.div>
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
